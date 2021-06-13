// Copyright (c) 2017 Matthew Brennan Jones <matthew.brennan.jones@gmail.com>
// This software is licensed under AGPL v3 or later
// http://github.com/workhorsy/comic_book_reader
"use strict";

function generate_random_user_id() {
	// Get a 18 character user id
	const code_table = "0123456789";
	let user_id = "";
	for (let i = 0; i < 18; ++i) {
		// Get a random number between 0 and 10
		const num = Math.floor((Math.random() * code_table.length));

		// Get the character that corresponds to the number
		user_id += code_table[num];
	}

	return user_id;
}

function settings_delete_all() {
	localStorage.removeItem('is_first_run');
	localStorage.removeItem('use_higher_quality_previews');
	localStorage.removeItem('use_smoothing_when_resizing_images');
	localStorage.removeItem('install_updates_enabled');
	localStorage.removeItem('right_click_enabled');
	localStorage.removeItem('db_names');
}

function settings_set(name, value) {
	localStorage.setItem(name, JSON.stringify(value));
}

function settings_get(name, default_value) {
	let value = localStorage.getItem(name);
	if (value) {
		return JSON.parse(value);
	} else {
		return default_value;
	}
}

function settings_has(name) {
	let value = localStorage.getItem(name);
	if (value) {
		return true;
	} else {
		return false;
	}
}

function settings_get_is_first_run() {
	return settings_get('is_first_run', true);
}

function settings_set_is_first_run(value) {
	settings_set('is_first_run', value);
}

function settings_get_use_higher_quality_previews() {
	return settings_get('use_higher_quality_previews', false);
}

function settings_set_use_higher_quality_previews(value) {
	settings_set('use_higher_quality_previews', value);
}

function settings_get_use_smoothing_when_resizing_images() {
	return settings_get('use_smoothing_when_resizing_images', true);
}

function settings_set_use_smoothing_when_resizing_images(value) {
	settings_set('use_smoothing_when_resizing_images', value);
}

function settings_get_install_updates_enabled() {
	return settings_get('install_updates_enabled', true);
}

function settings_set_install_updates_enabled(value) {
	settings_set('install_updates_enabled', value);
}

function settings_get_right_click_enabled() {
	return settings_get('right_click_enabled', false);
}

function settings_set_right_click_enabled(value) {
	settings_set('right_click_enabled', value);
}

function settings_get_db_names() {
	return settings_get('db_names', []);
}

function settings_set_db_names(value) {
	value.sort();
	settings_set('db_names', value);
}

function settings_get_user_id() {
	// Get or create the user id
	let user_id = null;
	if (! settings_has('user_id')) {
		user_id = generate_random_user_id();
		settings_set('user_id', user_id);
	}
	user_id = settings_get('user_id');

	// If the user id is longer than 18 characters, get a new one
	if (user_id.length > 18) {
		console.warn('The user_id was too long. Making a new one.');
		user_id = generate_random_user_id();
		settings_set('user_id', user_id);
	}

	return user_id;
}
