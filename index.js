const express = require('express');
const fs = require('fs');
const crowdin = require('@crowdin/crowdin-api-client');
const {} = new crowdin.default({
	token: 'personalAccessToken',
});
