'use strict';

var Blog = function () {

	var categoriesButton = document.querySelector('[data-categories-button]');
	var categoriesList = document.querySelector('[data-categories-list]');

	function init() {
		bindEvents();
	}

	function bindEvents() {
		categoriesButton.addEventListener('click', function (e) {
			e.currentTarget.classList.toggle('is-active');
			categoriesList.classList.toggle('is-visible');
		});
	}

	return {
		init: init
	};
}();

Blog.init();