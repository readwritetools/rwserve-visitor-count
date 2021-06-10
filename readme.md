












<figure>
	<img src='/img/plugins/visitor-count/visitor-count-unsplash-mostafa-meraji.jpg' width='100%' />
	<figcaption></figcaption>
</figure>

##### Open Source RWSERVE plugin

# Visitor Count

## Distinguish robots from humans


<address>
<img src='/img/48x48/rwtools.png' /> by <a href='https://readwritetools.com' title='Read Write Tools'>Read Write Tools</a> <time datetime=2018-09-11>Sep 11, 2018</time></address>



<table>
	<tr><th>Abstract</th></tr>
	<tr><td>This plugin is triggered each time a web browser requests your website's <code>favicon.ico</code>. Generally this happens the first time a visitor requests a page. Robots ignore this file, allowing this simple technique to serve as an easy way to count <i>human</i> visitors. Subsequent browser requests don't need to fetch this file again, so only unique new visitors are counted. </td></tr>
</table>

### Motivation

Monitoring website traffic is important for planning and evaluation purposes. Is
the website continuing to attract new visitors or is it declining in popularity?
Has a recent campaign been successful in attracting new visitors? Is it time to
contemplate adjustments or redesign?

Heavyweight solutions such as Google Analytics go far beyond this plugin's
capabilities, but at the risk of ceding control to a third party, which may not
be acceptable to your needs.

#### Customization

This plugin is open source and can be modified or enhanced to perform tasks such
as these:

   * Counting requests to two or more pages for A/B testing.
   * Summarizing activity over different periods, such as hourly or weekly.
   * Monitoring visitor click-paths based on the HTTP `referer` header.

### Download

The plugin module is available from <a href='https://www.npmjs.com/package/rwserve-visitor-count'>NPM</a>
. Before proceeding, you should already have `Node.js` and `RWSERVE` configured and
tested.

This module should be installed on your web server in a well-defined place, so
that it can be discovered by `RWSERVE`. The standard place for public domain
plugins is `/srv/rwserve-plugins`.

<pre>
cd /srv/rwserve-plugins
npm install rwserve-visitor-count
</pre>

### Configuration is Everything

Make the software available by declaring it in the `plugins` section of your
configuration file. For detailed instructions on how to do this, refer to the <a href='https://rwserve.readwritetools.com/plugins.blue'>plugins</a>
documentation on the `Read Write Tools HTTP/2 Server` website.

#### TL;DR

<pre>
plugins {
    rwserve-visitor-count {
        location `/srv/rwserve-plugins/node_modules/rwserve-visitor-count/dist/index.js`
        config {
            save-as `/var/log/rwserve/localhost.daily-counts.txt`      
        }
    }
    router {
        `/favicon.ico`  *methods=GET  *plugin=rwserve-visitor-count
    }    
}
</pre>

The `save-as` value is an absolute path to the file to be used to save the visitor
counts. Be sure to enclose this value in GRAVE-ACCENTS. The directory and file
will be created if they don't already exist. Both read and write permissions
must be allowed for the system user "rwserve".

The `router` only sends requests to the plugin when the HTTP method is `GET` and the
resource path is ```/favicon.ico```.

#### Cookbook

A full configuration file with typical settings for a server running on
localhost port 7443, is included in this NPM module at `etc/visitor-count-config`.
To use this configuration file, adjust these variables if they don't match your
server setup:

<pre>
$PLUGIN-PATH='/srv/rwserve-plugins/node_modules/rwserve-visitor-count/dist/index.js'
$PRIVATE-KEY='/etc/pki/tls/private/localhost.key'
$CERTIFICATE='/etc/pki/tls/certs/localhost.crt'
$DOCUMENTS-PATH='/srv/rwserve/configuration-docs'
$SAVE-AS='/var/log/rwserve/localhost.daily-counts.txt'
</pre>

### Usage

#### Server

Start the server using the configuration file just prepared. Use Bash to start
the server in the background, like this:

<pre>
[user@host ~]# rwserve /srv/rwserve-plugins/node_modules/rwserve-visitor-count/etc/visitor-count-config &
</pre>

#### Browser

Use your browser to navigate to the website's homepage, which will automatically
trigger a request for `favicon.ico`:

<pre>
https://localhost:7443/        
</pre>

#### Shutdown and Save

Finally, shut down the server using the process ID of the server. The visitor
count file will be saved during the shutdown process.

<pre>
[user@host ~]# kill PID
</pre>

#### Deployment

Once you've tested the plugin and are ready to go live, adjust your production
web server's configuration in `/etc/rwserve/rwserve.conf` and restart it using `systemd`
. . .

<pre>
[user@host ~]# systemctl restart rwserve
</pre>

. . . then monitor its request/response activity with `journald`.

<pre>
[user@host ~]# journalctl -u rwserve -ef
</pre>

### Prerequisites

This is a plugin for the **Read Write Tools HTTP/2 Server**, which works on Linux
platforms.


<table>
	<tr><th>Software</th> <th>Minimum Version</th> <th>Most Recent Version</th></tr>
	<tr><td>Ubuntu</td> 		<td>16 Xenial Xerus</td> <td>16 Xenial Xerus</td></tr>
	<tr><td>Debian</td> 		<td>9 Stretch</td> 		<td>10 Buster</td></tr>
	<tr><td>openSUSE</td>	<td>openSUSE 15.1</td> 	<td>openSUSE 15.1</td></tr>
	<tr><td>Fedora</td> 		<td>Fedora 27</td> 		<td>Fedora 32</td></tr>
	<tr><td>CentOS</td>		<td>CentOS 7.4</td>		<td>CentOS 8.1</td></tr>
	<tr><td>RHEL</td> 		<td>RHEL 7.8</td>		<td>RHEL 8.2</td></tr>
	<tr><td>RWSERVE</td>		<td>RWSERVE 1.0.1</td>	<td>RWSERVE 1.0.47</td></tr>
	<tr><td>Node.js</td>		<td>Node.js 10.3</td>	<td>Node.js 12.17</td></tr>
</table>

### Review


<table>
	<tr><th>Lessons</th></tr>
	<tr><td>This plugin demonstrates these concepts: <ul><li>Basic plugin and configuration patterns.</li> <li>How to use the <code>shutdown()</code> method to save state.</li> </ul> Find other plugins for the <code>Read Write Tools HTTP/2 Server</code> using <a href='https://www.npmjs.com/search?q=keywords:rwserve'>npm</a> with these keywords: <kbd>rwserve</kbd>, <kbd>http2</kbd>, <kbd>plugins</kbd>. </td></tr>
</table>

### License

The <span>rwserve-visitor-count</span> plugin is licensed under
the MIT License.

<img src='/img/blue-seal-mit.png' width=80 align=right />

<details>
	<summary>MIT License</summary>
	<p>Copyright © 2020 Read Write Tools.</p>
	<p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>
	<p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
	<p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
</details>

### Availability


<table>
	<tr><td>Source code</td> 			<td><a href='https://github.com/readwritetools/rwserve-visitor-count'>github</a></td></tr>
	<tr><td>Package installation</td> <td><a href='https://www.npmjs.com/package/rwserve-visitor-count'>NPM</a></td></tr>
	<tr><td>Documentation</td> 		<td><a href='https://hub.readwritetools.com/plugins/visitor-count.blue'>Read Write Hub</a></td></tr>
</table>

