

<a href='https://rwserve.readwritetools.com'><img src='./img/rwserve.png' width=80 align=right /></a>

###### *Easily count website traffic using `favicon.ico` *

# RWSERVE Visitor Count


<table>
	<tr><th>Abstract</th></tr>
	<tr><td>This plugin is triggered each time a web browser requests your website's <code>favicon.ico</code>. Generally this happens the first time a visitor requests a page. Robots ignore this file, allowing this simple technique to serve as an easy way to count <i>human</i> visitors. Subsequent browser requests don't need to fetch this file again, so only unique new visitors are counted. </td></tr>
</table>

## Prerequisites

This is a plugin for the **Read Write Tools HTTP/2 Server**, which works on Linux
platforms. Windows, MacOS and BSD are not supported.


<table>
	<tr><th>Software</th> <th>Minimum Version</th></tr>
	<tr><td>Ubuntu</td> <td>16</td></tr>
	<tr><td>Debian</td> <td>9</td></tr>
	<tr><td>Fedora</td> <td>27</td></tr>
	<tr><td>CentOS</td> <td>7.4</td></tr>
	<tr><td>RHEL</td> <td>8</td></tr>
	<tr><td>RWSERVE</td> <td>1.0</td></tr>
	<tr><td>Node.js</td> <td>10.3</td></tr>
</table>

## Download

The plugin module is available from <a href='https://www.npmjs.com/package/rwserve-visitor-count'>NPM</a>. Before proceeding, you should already have
`Node.js` and `RWSERVE` configured and tested.

This module should be installed on your web server in a well-defined place, so
that it can be discovered by `RWSERVE`. The standard place for public domain
plugins is `/srv/rwserve-plugins`.

<pre>
cd /srv/rwserve-plugins
npm install rwserve-visitor-count
</pre>

## Configuration is Everything

Make the software available by declaring it in the `plugins` section of your
configuration file. For detailed instructions on how to do this, refer to the <a href='https://rwserve.readwritetools.com/plugins.blue'>plugins</a> documentation
on the `Read Write Tools HTTP/2 Server` website.

#### TL;DR

<pre>
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
</pre>

#### Cookbook

A full configuration file with typical settings for a server running on
localhost port 7443, is included in this NPM module at `etc/visitor-count-config`.
To use this configuration file, adjust these variables if they don't match your
server setup:

<pre>
$PLUGIN-PATH='/srv/rwserve-plugins/rwserve-visitor-count/dist/index.js'
$PRIVATE-KEY='/etc/pki/tls/private/localhost.key'
$CERTIFICATE='/etc/pki/tls/certs/localhost.crt'
$DOCUMENTS-PATH='/srv/rwserve/configuration-docs'
$SAVE-AS='/var/log/rwserve/localhost.daily-counts.txt'
</pre>

## Testing

#### Server

Start the server using the configuration file just prepared. Use Bash to start
the server in the background, like this:

<pre>*[user@host ~]#*
 rwserve /srv/rwserve-plugins/rwserve-visitor-count/etc/visitor-count-config &
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

<pre>*[user@host ~]#*
 kill PID
</pre>

## Lessons


<table>
	<tr><th>Summary</th></tr>
	<tr><td>This plugin demonstrates these concepts: <ul><li>Basic plugin and configuration patterns.</li> <li>How to use the <code>shutdown()</code> method to save state.</li> </ul> Find other plugins for the <code>Read Write Tools HTTP/2 Server</code> using <a href='https://npmsearch.com?q=author:readwritetools'>npmsearch</a> with these keywords: <kbd>rwserve</kbd>, <kbd>http/2</kbd>, <kbd>plugin</kbd>. </td></tr>
</table>

<p align=center><a href='https://readwritetools.com'><img src='./img/rwtools.png' width=80 /></a></p>
