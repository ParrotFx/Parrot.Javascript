##Sample View Model

    {
      header: "Parrot",
      description: "Something something about Parrot",
      features:[
        "Familiar syntax",
        "Extensible output",
        "Simple model binding"
      ]
    };


##Sample Template

    doctype
    html {
      head > title > "This is Parrot!"
      body {
        h1#header > @header
        p#tagname.small > "All new Asp.Net View Engine"
        div#description.rounded-corners {
          h2 > "Features"
          ul(features) > li > @this
        }
      }
    }


##Html Output

    <!DOCTYPE html>
    <html>
      <head>
        <title>This is Parrot!</title>
      </head>
      <body>
        <h1 id="header">Parrot</h1>
        <p class="small" id="tagname">All new Asp.Net View Engine</p>
        <div class="rounded-corners" id="description">
            <h2>Features</h2>
            <ul>
              <li>Familiar syntax</li>
              <li>Extensible output</li>
              <li>Simple model binding</li>
            </ul>
        </div>
      </body>
    </html>

