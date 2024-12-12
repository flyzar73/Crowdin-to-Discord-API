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

function downloadTranslations() {
	config.localization['list-local'].forEach(async (language) => {
		const downloadLink = await translationsApi.buildProjectFileTranslation(projectId, fileId, {
			targetLanguageId: language,
		});
		const response = await fetch(downloadLink.data.url);
		const translations = await response.json();
		fs.writeFileSync(`./src/locals/local_${language}.json`, JSON.stringify(translations));
	});
}

function getAllLocals() {
	let local = [];
	config.localization['list-local'].forEach((language) => {
		local[language] = JSON.parse(fs.readFileSync(`./src/locals/local_${language}.json`)); //translation
		if (config.local['use-default-local']) {
			local.default = JSON.parse(fs.readFileSync(`./src/local.json`)); //default (English)
		}
	});

	return local;
}

function allLocalToBuild(locals) {
	if (config.local['use-default-local']) {
		model = JSON.parse(fs.readFileSync(`./src/local.json`)); //default (English)
	} else {
		model = JSON.parse(fs.readFileSync(`./src/build/local_${config.localization['list-local'][0]}.json`));
	}
	let endLocal = {};
	for (const Category in model) {
		const CategoryChild = model[Category];
		endLocal[Category] = {};
		for (const SubCategory in CategoryChild) {
			const SubCategoryChild = CategoryChild[SubCategory];
			if (typeof SubCategoryChild == 'object') {
				endLocal[Category][SubCategory] = {};
				for (const UnderCategory in SubCategoryChild) {
					const UnderCategoryChild = UnderCategory[UnderCategory];

					if (typeof UnderCategoryChild == 'object') {
						endLocal[Category][SubCategory] = {};
						for (const EndCategory in UnderCategoryChild) {
							endLocal[Category][SubCategory][UnderCategory][EndCategory] = {};
							for (const local in locals) {
								endLocal[Category][SubCategory][UnderCategory][EndCategory][local] = locals[local][Category][SubCategory][EndCategory][UnderCategory] ?? null;
							}
						}
					} else {
						endLocal[Category][SubCategory][UnderCategory] = {};
						for (const local in locals) {
							endLocal[Category][SubCategory][UnderCategory][local] = locals[local][Category][SubCategory][UnderCategory] ?? null;
						}
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
	if (!fs.existsSync('./src/')) {
		fs.mkdirSync('./src/');
	}
	if (!fs.existsSync('./src/build')) {
		fs.mkdirSync('./src/build');
	}
	if (!fs.existsSync('./src/locals')) {
		fs.mkdirSync('./src/locals');
	}

	if (!fs.existsSync('./src/local.json') && config.local['use-default-local']) return console.error('ERR | There no default local, read doc');

	downloadTranslations();

	setTimeout(() => {
		allLocalToBuild(getAllLocals());
	}, 5000);

	require('./api.js');
}

start();
