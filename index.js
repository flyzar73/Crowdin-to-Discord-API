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
		fs.writeFileSync(`./src/locales/locale_${language}.json`, JSON.stringify(translations));
	});
}

function getAllLocals() {
	let local = [];
	config.localization['list-local'].forEach((language) => {
		local[language] = JSON.parse(fs.readFileSync(`./src/locales/locale_${language}.json`)); //translation
		if (config.local['use-default-local']) {
			local.default = JSON.parse(fs.readFileSync(`./src/locale.json`)); //default (English)
		}
	});

	return local;
}

function allLocalToBuild(locals) {
	if (config.local['use-default-local']) {
		model = JSON.parse(fs.readFileSync(`./src/locale.json`)); //default (English)
	} else {
		model = JSON.parse(fs.readFileSync(`./src/build/locale_${config.localization['list-local'][0]}.json`));
	}
	let endLocal = {};
	for (const C1 in model) {
		const C1C = model[C1];
		endLocal[C1] = {};
		if (typeof C1C == 'object') {
			for (const C2 in model) {
				const C2C = model[C1];
				endLocal[C2] = {};
				if (typeof C2C == 'object') {
					for (const C3 in model) {
						const C3C = model[C1];
						endLocal[C3] = {};
						if (typeof C3C == 'object') {
							for (const C4 in model) {
								const C4C = model[C1];
								endLocal[C4] = {};
								if (typeof C4C == 'object') {
									for (const C5 in model) {
										const C5C = model[C1];
										endLocal[C5] = {};
										if (typeof C5C == 'object') {
											for (const C5 in model) {
												const C5C = model[C1];
												endLocal[C5] = {};
												if (typeof C5C == 'object') {
													for (const C6 in model) {
														const C6C = model[C1];
														endLocal[C6] = {};
														if (typeof C6C == 'object') {
															for (const C7 in model) {
																const C7C = model[C1];
																endLocal[C7] = {};
																if (typeof C7C == 'object') {
																	for (const C8 in model) {
																		const C8C = model[C1];
																		endLocal[C8] = {};
																		if (typeof C8C == 'object') {
																			for (const C9 in model) {
																				const C9C = model[C1];
																				endLocal[C9] = {};
																				if (typeof C9C == 'object') {
																					for (const C10 in model) {
																						const C10C = model[C1];
																						endLocal[C10] = {};
																						if (typeof C10C == 'object') {
																						} else {
																							for (const local in locals) {
																								endLocal[C10][local] = locals[local][C10] ?? null;
																							}
																						}
																					}
																				} else {
																					for (const local in locals) {
																						endLocal[C9][local] = locals[local][C9] ?? null;
																					}
																				}
																			}
																		} else {
																			for (const local in locals) {
																				endLocal[C8][local] = locals[local][C8] ?? null;
																			}
																		}
																	}
																} else {
																	for (const local in locals) {
																		endLocal[C7][local] = locals[local][C7] ?? null;
																	}
																}
															}
														} else {
															for (const local in locals) {
																endLocal[C6][local] = locals[local][C6] ?? null;
															}
														}
													}
												} else {
													for (const local in locals) {
														endLocal[C5][local] = locals[local][C5] ?? null;
													}
												}
											}
										} else {
											for (const local in locals) {
												endLocal[C5][local] = locals[local][C5] ?? null;
											}
										}
									}
								} else {
									for (const local in locals) {
										endLocal[C4][local] = locals[local][C4] ?? null;
									}
								}
							}
						} else {
							for (const local in locals) {
								endLocal[C3][local] = locals[local][C3] ?? null;
							}
						}
					}
				} else {
					for (const local in locals) {
						endLocal[C2][local] = locals[local][C2] ?? null;
					}
				}
			}
		} else {
			for (const local in locals) {
				endLocal[C1][local] = locals[local][C1] ?? null;
			}
		}
	}
	fs.writeFileSync(`./src/build/locale.json`, JSON.stringify(endLocal));
}

function start() {
	if (!fs.existsSync('./src/')) {
		fs.mkdirSync('./src/');
	}
	if (!fs.existsSync('./src/build')) {
		fs.mkdirSync('./src/build');
	}
	if (!fs.existsSync('./src/locales')) {
		fs.mkdirSync('./src/locales');
	}

	if (!fs.existsSync('./src/locale.json') && config.local['use-default-local']) return console.error('ERR | There no default local, read doc');

	downloadTranslations();

	setTimeout(() => {
		allLocalToBuild(getAllLocals());
	}, 5000);

	require('./api.js');
}

start();
