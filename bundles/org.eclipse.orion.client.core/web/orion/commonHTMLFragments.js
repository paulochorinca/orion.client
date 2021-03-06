/*******************************************************************************
 * @license
 * Copyright (c) 2011, 2012 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials are made 
 * available under the terms of the Eclipse Public License v1.0 
 * (http://www.eclipse.org/legal/epl-v10.html), and the Eclipse Distribution 
 * License v1.0 (http://www.eclipse.org/org/documents/edl-v10.html). 
 *
 * Contributors:
 *     IBM Corporation - initial API and implementation
 *******************************************************************************/
/*global window document define login logout localStorage orion */
/*browser:true*/

define(['i18n!orion/nls/messages', 'require'], 
        function(messages, require){
	
	/**
	 * This class contains static utility methods. It is not intended to be instantiated.
	 * @class This class contains HTML fragments for the common banner, footer, toolbars
	 * @name orion.commonHTMLFragments
	 */

	// BEGIN TOP BANNER FRAGMENT
	var topHTMLFragment =
	
	'<header role="banner">' + //$NON-NLS-0$
		//Top row:  Logo + discovery links + user
		'<div id="staticBanner" class="layoutBlock topRowBanner">' + //$NON-NLS-0$
			'<a id="home" class="layoutLeft logo" href="' + require.toUrl("navigate/table.html") + '" aria-label="'+messages['Orion Home']+'"><img src="' + require.toUrl("images/orion-transparent.png") + '" alt="'+messages['Orion Logo']+'"/></a>' + //$NON-NLS-8$ //$NON-NLS-6$ //$NON-NLS-5$ //$NON-NLS-4$ //$NON-NLS-2$ //$NON-NLS-1$ //$NON-NLS-0$
			'<nav id="primaryNav" class="layoutLeft primaryNav" role="navigation"></nav>' + //$NON-NLS-0$
			'<div class="layoutRight">' + //$NON-NLS-0$
				'<div id="globalActions" class="spacingLeft layoutLeft"></div>' + //$NON-NLS-0$
				'<div id="relatedLinks" class="spacingLeft layoutLeft" style="padding-top:1px;"></div>' + //$NON-NLS-0$
				'<input type="text" id="search" placeholder="Search" title="'+messages['Type a keyword or wild card to search in root']+'" class="layoutLeft spacingLeft searchbox" role="search">' + //$NON-NLS-2$ //$NON-NLS-0$
				// '<div id="userInfo" style= "display:none;" class="layoutLeft primaryNav"></div>' + //$NON-NLS-0$
				'<div id="userMenu" class="spacingLeft layoutLeft"></div>' + //$NON-NLS-0$
			'</div>' + //$NON-NLS-0$
		'</div>' + //$NON-NLS-0$
		//Title area
		'<div id="titleArea" class="layoutBlock titleArea">' + //$NON-NLS-0$
			'<div class="layoutLeft pageTitle"></div>' + //$NON-NLS-0$
			'<div class="clear" style="padding-bottom:5px;display:inline;"><span id="location" class="currentLocation"></span><span id="dirty" class="currentLocation"></span></div>' + //$NON-NLS-0$
			'<div class="layoutRight pageNav">' + //$NON-NLS-0$
				'<span id="pageFavorite" tabindex="0" role="button" aria-label="'+messages['Add this page to the favorites list']+'" class="spacingLeft layoutLeft imageSprite core-sprite-favorite_sml"></span>' + //$NON-NLS-2$ //$NON-NLS-0$
			'</div>' + //$NON-NLS-0$
		'</div>' + //$NON-NLS-0$
	'</header>'; //$NON-NLS-0$
	// END TOP BANNER FRAGMENT
	
	// BEGIN BOTTOM BANNER FRAGMENT
	// styling of the surrounding div (text-align, etc) is in ide.css "footer"
	var bottomHTMLFragment = 
		'<footer id="footerContent" class="layoutBlock" role="contentinfo">' + //$NON-NLS-0$
			'<div class="footerBlock">' + //$NON-NLS-0$
				messages['Orion is in Beta. Please try it out but BEWARE your data may be lost.'] +
			'</div>' + //$NON-NLS-0$
			'<div class="footerRightBlock">' + //$NON-NLS-0$
				'<a href="http://wiki.eclipse.org/Orion/FAQ" target="_blank">'+messages['FAQ']+'</a> | ' +  //$NON-NLS-0$
				'<a href="https://bugs.eclipse.org/bugs/enter_bug.cgi?product=Orion&version=0.5" target="_blank">'+messages['Report a Bug']+'</a> | ' + //$NON-NLS-0$
				'<a href="http://www.eclipse.org/legal/privacy.php" target="_blank">'+messages['Privacy Policy']+'</a> | ' +  //$NON-NLS-0$
				'<a href="http://www.eclipse.org/legal/termsofuse.php" target="_blank">'+messages['Terms of Use']+'</a> | '+  //$NON-NLS-0$
				'<a href="http://www.eclipse.org/legal/copyright.php" target="_blank">'+messages['Copyright Agent']+'</a>'+ //$NON-NLS-0$
			'</div>' + //$NON-NLS-0$
		'</footer>'; //$NON-NLS-0$
	// END BOTTOM BANNER FRAGMENT

	function slideoutHTMLFragment(id) { 
		return '<div id="'+id+'slideContainer" class="layoutBlock slideParameters slideContainer">' + //$NON-NLS-1$ //$NON-NLS-0$
			'<span id="'+id+'pageParameterArea" class="slide">' + //$NON-NLS-1$ //$NON-NLS-0$
				'<span id="'+id+'pageCommandParameters" class="layoutLeft parameters"></span>' + //$NON-NLS-1$ //$NON-NLS-0$
				'<span id="'+id+'pageCommandDismiss" class="layoutRight parametersDismiss"></span>' + //$NON-NLS-1$ //$NON-NLS-0$
			'</span>' + //$NON-NLS-0$
		'</div>'; //$NON-NLS-0$
	}
	
	var toolbarHTMLFragment = 
		'<ul class="layoutLeft commandList pageActions" id="pageActions"></ul>' + //$NON-NLS-0$
		'<ul class="layoutLeft commandList pageActions" id="selectionTools"></ul>' + //$NON-NLS-0$
		'<img class="layoutRight progressPane" src="'+ require.toUrl("images/none.png") +'" id="progressPane" tabindex="0" role="progressbar" aria-label="'+messages['Operations - Press spacebar to show current operations']+'"></img>' + //$NON-NLS-4$ //$NON-NLS-2$ //$NON-NLS-1$ //$NON-NLS-0$
		'<div class="layoutRight status" id="statusPane" role="status" aria-live="off"></div>' + //$NON-NLS-0$
		'<ul class="layoutRight commandList pageActions" id="pageNavigationActions"></ul>' + //$NON-NLS-0$
		'<div id="notificationArea" class="layoutLeft layoutBlock slideContainer">' + //$NON-NLS-0$
				'<div class="layoutLeft" id="notifications" aria-live="assertive" aria-atomic="true"></div>' + //$NON-NLS-0$
				'<div class="layoutRight"><span tabindex="0" role="button" aria-label="Close notification" class="layoutRight core-sprite-close imageSprite" id="closeNotifications"></span></div>' + //$NON-NLS-0$
		'</div>' + slideoutHTMLFragment("mainToolbar"); //$NON-NLS-1$ //$NON-NLS-0$
		
	
	//return the module exports
	return {
		topHTMLFragment: topHTMLFragment,
		bottomHTMLFragment: bottomHTMLFragment,
		toolbarHTMLFragment: toolbarHTMLFragment,
		slideoutHTMLFragment: slideoutHTMLFragment
	};
});
