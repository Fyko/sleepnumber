# SleepNumber API
I made this API so I could create an iOS Shortcut to soften my bed when I turn on Do Not Disturb.

> **Warning**: You cannot test this locally. Cookies are not passed due to [cloduflare/miniflare#183](https://github.com/cloudflare/miniflare/issues/183).

## Setup
Create your env file:  
```env
API_USERNAME=admin
API_PASSWORD=mycomplexapipassword
SLEEPNUMBER_EMAIL=
SLEEPNUMBER_PASSWORD=
```  
Then head over to Cloudflare and upload these values.

## Usage
**`POST`** `/api/sleepnumber`

**Authentication**: Basic, `{API_USERNAME}:{API_PASSWORD}`  

__JSON Body__  

|Key|Type|Description|
|-|-|-|
|sleep_number|int|what value to set the sleep number to|
|side|'R'\|'L'|which side to set|
|bed_id|string|the id of the bed to update|

__Response__  

**Type**: `string`  
__Values__
- `Adjusting the {right|left} side to {value}.`
- `Failed to adjust the {right|left} side to {value}.`
