function boot() {
    
    // http://perishablepress.com/press/2009/11/09/perfect-pre-tags/
    // only apply to IE  
	if (!/*@cc_on!@*/0) return;  
	// find every element to test  
	var all = document.getElementsByTagName('*'), i = all.length;  
	// fast reverse loop  
	while (i--) {    
		// if the scrollWidth (the real width) is greater than 
		// the visible width, then apply style changes    
		if (all[i].scrollWidth > all[i].offsetWidth) {
			all[i].style['paddingBottom'] = '32px';
			all[i].style['overflowY'] = 'hidden';
		}
	}

}