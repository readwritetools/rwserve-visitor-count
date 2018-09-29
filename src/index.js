//=============================================================================
//
// File:         rwserve-visitor-count/src/index.js
// Language:     ECMAScript 2015
// Copyright:    Read Write Tools © 2018
// License:      MIT License
// Initial date: Aug 25, 2018
//
// Contents:     An RWSERVE plugin to count how many unique browser-based requestors 
//               visit the website each day. 
//               The basic premise is that browsers request favicon.ico, while crawlers do not.
//               
//               Maintain a counter in memory that grows throughout the day,
//               then, on tomorrow's first visit, capture that number and save it to 
//               the declared 'save-as' file location.
//
//======================== Sample configuration ===============================
/*
	plugins {
		rwserve-visitor-count {
			location `/srv/rwserve-plugins/rwserve-visitor-count/dist/index.js`
			config {
				save-as `/var/log/rwserve/localhost.daily-counts.txt`  	
			}
		}
		router {
			`/favicon.ico`  *methods=GET  *plugin=rwserve-visitor-count
		}	
	}
*/
//=============================================================================

import {log} 		from 'rwserve-plugin-sdk';
import fs			from 'fs';
import path			from 'path';

export default class RwserveVisitorCount {

	constructor(hostConfig) {
		this.hostConfig = hostConfig;
		this.visitorCountConfig = hostConfig.pluginsConfig.rwserveVisitorCount;		
		this.saveAs = '';											// an absolute filename
		this.currentDayOfMonth = new Date().getDate();				// a number from 1 to 31
		this.counter = 0;											// number of visitor since beginning of today, or since server start
    	Object.seal(this);
	}
	
	async startup() {
		log.debug('RwserveVisitorCount', `version ${this.visitorCountConfig.pluginVersion}; © 2018 Read Write Tools; MIT License`); 

		// sanitize, using fallback if necessary
		if (this.visitorCountConfig.saveAs && this.visitorCountConfig.saveAs.sourceref)
			this.saveAs = this.visitorCountConfig.saveAs.sourceref;
		if (this.saveAs === undefined || this.saveAs === null || this.saveAs == '')
			this.saveAs = '/var/log/rwserve/localhost.daily-counts.txt';
		
		try {
			if (fs.existsSync(this.saveAs)) {
				log.debug('RwserveVisitorCount', `will save to the existing file ${this.saveAs}`);
			}
			else {
				this.makeSaveAsPath();
				log.debug('RwserveVisitorCount', `will save to a new file ${this.saveAs}`);
			}
		}
		catch(err) {
			log.caught(err);
		}
	}
	
	async shutdown() {
		log.debug('RwserveVisitorCount', `Shutting down ${this.hostConfig.hostname}`); 
		
		this.saveVisitorCount('today');
	}
	
	// This is the main entry point called by RWSERVE for each request/response
	async processingSequence(workOrder) {
		// have we rolled over into a new day?
		var todaysDate = new Date().getDate();
		if (this.currentDayOfMonth != todaysDate) {
			this.saveVisitorCount('yesterday');
			this.currentDayOfMonth = todaysDate;
		}
		
		// increment the number of visitors
		this.counter++;
	}
	
	saveVisitorCount(todayYesterday) {
		try {
			var unixDate = new Date();
			if (todayYesterday == 'yesterday')
				unixDate.setDate(unixDate.getDate() - 1);
			var yyyymmdd = this.dateToString(unixDate);
			
			// save new file with one line
			if (!fs.existsSync(this.saveAs)) {
				this.makeSaveAsPath(this.saveAs);
				fs.writeFileSync(this.saveAs, `${yyyymmdd}\t${this.counter}\n`);
			}
			
			// append to existing file
			else {
				var contents = fs.readFileSync(this.saveAs, 'utf8');
				var lines = contents.split('\n');
				
				// loop over all lines looking for yyyymmdd
				var found = false;
				for (let i=0; (i < lines.length) && (found == false); i++) {
					
					// each line has a date and a counter, separated by a tab
					var parts = lines[i].split('\t');
					if (parts.length == 2) {
						var datePart = parts[0];
						var counterPart = parts[1];
						
						// add the current value to the previously saved value 
						if (datePart == yyyymmdd) {
							var sum = parseInt(counterPart) + parseInt(this.counter);
							lines[i] = `${yyyymmdd}\t${sum}`
							found = true;
						}
					}
				}
				// append a new line for this date's counts
				if (!found)
					lines.push(`${yyyymmdd}\t${this.counter}`);
				
				fs.writeFileSync(this.saveAs, lines.join('\n'));
			}
			
			log.debug('RwserveVisitorCount', `Saved ${yyyymmdd} = ${this.counter} to ${this.saveAs}`); 
		}
		catch(err) {
			log.error(err.message);
		}
	}
	
	// drop the filename from the fullPath, and make directories for all the leading parts
	makeSaveAsPath() {
		this.saveAs = path.normalize(this.saveAs);		// fix up ../ and //
		
		if (!path.isAbsolute(this.saveAs)) {
			log.config(`Path to saveAs file should be an absolute path, '${this.saveAs}'`);
			return;
		}
			
		var parts = this.saveAs.split('/');
		if (parts.length <= 1) {
			return;										// empty string or filename only, nothing to do
		}
		
		var partialPath = '';
		for (let i=1; i < parts.length-1; i++) {		// skip parts[0], which s/b an empty string for absolute paths
			partialPath += '/' + parts[i];
			if (!fs.existsSync(partialPath))
				fs.mkdirSync(partialPath);
		}
	}
	
	// timestamp -> YYYY-MM-DD
	// local time, not UTC
	dateToString(unixDate) {
		var year  = unixDate.getFullYear().toString();
		var month = unixDate.getMonth().toString().padStart(2, '0');
		var date  = unixDate.getDate().toString().padStart(2, '0');
		return `${year}-${month}-${date}`;
	}
}
