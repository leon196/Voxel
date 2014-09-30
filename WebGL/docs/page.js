var onDocumentLoad = function ( event ) {

	var path;
	var pathname = window.location.pathname;
	var section = /\/(manual|api)\//.exec( pathname )[ 1 ].toString().split( '.html' )[ 0 ];
	var name = /[\-A-z0-9]+\.html/.exec( pathname ).toString().split( '.html' )[ 0 ];

	if ( section == 'manual' ) {

		name = name.replace(/\-/g, ' ');

		path = pathname.replace( /\ /g, '-' );
		path = /\/manual\/[-A-z0-9\/]+/.exec( path ).toString().substr( 8 );

	} else {

		path = /\/api\/[A-z0-9\/]+/.exec( pathname ).toString().substr( 5 );

	}

	var text = document.body.innerHTML;

	text = text.replace(/\[name\]/gi, name);
	text = text.replace(/\[path\]/gi, path);
	text = text.replace(/\[page:(\w+)\]/gi, "[page:$1 $1]" ); // [page:name] to [page:name title]
	text = text.replace(/\[page:(\w+) ([\w|\.]+)\]/gi, "<a href=\"javascript:window.parent.goTo('$1')\" title=\"$1\">$2</a>" ); // [page:name title]
	text = text.replace(/\[link:([\w|\:|\/|\.|\-|\_]+)\]/gi, "[link:$1 $1]" ); // [link:url] to [link:url title]
	text = text.replace(/\[link:([\w|\:|\/|\.|\-|\_|\(|\)]+) ([\w|\:|\/|\.|\-|\_ ]+)\]/gi, "<a href=\"$1\"  target=\"_blank\">$2</a>" ); // [link:url title]
	text = text.replace(/\*([\w|\d|\"|\-|\(][\w|\d|\ |\-|\/|\+|\-|\(|\)|\=|\,|\.\"]*[\w|\d|\"|\)]|\w)\*/gi, "<strong>$1</strong>" ); // *

	document.body.innerHTML = text;

	// handle code snippets formatting

	var elements = document.getElementsByTagName( 'code' );

	for ( var i = 0; i < elements.length; i ++ ) {

		var element = elements[ i ];

		text = element.textContent.trim();
		text = text.replace( /^\t\t/gm, '' );

		element.textContent = text;

	}

	// Edit button

	var button = document.createElement( 'div' );
	button.id = 'button';
	button.textContent = 'Edit this page';

	button.addEventListener( 'click', function ( event ) {

		window.open( 'https://github.com/mrdoob/three.js/blob/dev/docs/' + section + '/' + path + '.html' );

	}, false );

	document.body.appendChild( button );

	// Syntax highlighting

	var styleBase = document.createElement( 'link' );
	styleBase.href = '../../prettify/prettify.css';
	styleBase.rel = 'stylesheet';

	var styleCustom = document.createElement( 'link' );
	styleCustom.href = '../../prettify/threejs.css';
	styleCustom.rel = 'stylesheet';

	document.head.appendChild( styleBase );
	document.head.appendChild( styleCustom );

	var prettify = document.createElement( 'script' );
	prettify.src = '../../prettify/prettify.js';

	prettify.onload = function () {

		var elements = document.getElementsByTagName( 'code' );

		for ( var i = 0; i < elements.length; i ++ ) {

			var e = elements[ i ];
			e.className += ' prettyprint';

		}

		prettyPrint();

	}

	document.head.appendChild( prettify );

};

document.addEventListener( 'DOMContentLoaded', onDocumentLoad, false );
