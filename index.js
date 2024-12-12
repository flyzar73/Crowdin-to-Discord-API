const express = require('express');
const fs = require('fs');
const crowdin = require('@crowdin/crowdin-api-client');
const config = require('./config.json');
const { stringify } = require('querystring');
const { subscribe } = require('diagnostics_channel');
const { projectsGroupsApi, uploadStorageApi, sourceFilesApi, translationsApi } = new crowdin.default({
	token: config.crowdin.token,
});
const projectId = config.crowdin['app-id'];
const fileId = config.crowdin['file-id'];

async function downloadTranslations(language) {
	const downloadLink = await translationsApi.buildProjectFileTranslation(projectId, fileId, {
		targetLanguageId: language,
	});
	const response = await fetch(downloadLink.data.url);
	const translations = await response.json();
	fs.writeFileSync(`./src/locals/local_${language}.json`, JSON.stringify(translations));
}

function getAllLocals() {
	let local = [];
	config.localization['list-local'].forEach((language) => {
		local[language] = JSON.parse(fs.readFileSync(`./src/locals/local_${language}.json`)); //translation
		local.default = JSON.parse(fs.readFileSync(`./src/local.json`)); //default (English)
	});

	return local;
}

function allLocalToBuild(locals) {
	model = JSON.parse(fs.readFileSync(`./src/local.json`)); //default (English)
	let endLocal = {};
	console.log(model);
	for (const Category in model) {
		const CategoryChild = model[Category];
		endLocal[Category] = {};
		console.log(Category);
		for (const SubCategory in CategoryChild) {
			const SubCategoryChild = CategoryChild[SubCategory];
			console.log(SubCategory);
			if (typeof SubCategoryChild == 'object') {
				endLocal[Category][SubCategory] = {};
				for (const UnderCategory in SubCategoryChild) {
					endLocal[Category][SubCategory][UnderCategory] = {};
					for (const local in locals) {
						endLocal[Category][SubCategory][UnderCategory][local] = locals[local][Category][SubCategory][UnderCategory] ?? null;
					}
				}
			} else {
				endLocal[Category][SubCategory] = {};
				for (const local in locals) {
					endLocal[Category][SubCategory][local] = locals[local][Category][SubCategory] ?? null;
				}
			}
		}
	}
	fs.writeFileSync(`./src/build/local.json`, JSON.stringify(endLocal));
}

function start() {
	config.localization['list-local'].forEach((language) => {
		downloadTranslations(language);
	});

	allLocalToBuild(getAllLocals());
}

start();
