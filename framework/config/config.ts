import 'dotenv/config'

const config = {
    apiURL: process.env.TEST_BOOKER_API_URL,
    apiUsername: process.env.TEST_API_USERNAME,
    apiPassword: process.env.TEST_API_PASSWORD,
    uiURL: process.env.TEST_UI_URL || '',
}

export { config }