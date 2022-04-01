# SleepNumber API
... and accompanying iOS shortcut. 

> **Warning**: You cannot test this locally. Cookies are not passed due to [cloduflare/miniflare#183](https://github.com/cloudflare/miniflare/issues/183).

## Setup
1. Create your env file:  
```env
API_USERNAME=admin
API_PASSWORD=
SLEEPNUMBER_EMAIL=
SLEEPNUMBER_PASSWORD=
```

```bash
$ npx wrangler@beta login # log into wrangler
$ npx wrangler@beta publish # publish the API

# IMPORTANT: upload your env vars from above to Cloudflare

$ curl -u ${API_USERNAME}:${API_PASSWORD} https://<*.*.workers.dev>/api/beds | json_pp
# ^ take note of the `bedId` of the bed you're setting up automation for
# set sleep number
$ curl --request POST \
  --url https://<*.*.workers.dev>/api/sleepnumber \
  -u ${API_USERNAME}:${API_PASSWORD} \
  --header 'Content-Type: application/json' \
  --data '{
	"sleep_number": <int>,
	"side": "<R|L>",
	"bed_id": "<bed id>"
}'
```

2. Log into Wrangler with `npx wrangler@beta login`.

3. Deploy the API with `npx wrangler@beta publish`.

4. Create your Authorization header by running ``

5. Once deployed, visit `{API_BASE}/api/beds` to get a list of beds associated with your account. Note the `bedId` of the bed you'd like to setup the automation for.

### iOS Shortcuts
There are two iOS Shortcuts for setting your sleep number in the evening and in the morning.

#### Bed Time
Before adding the shortcut, ensure you have the following values on hand:
- Worker Base URL (sleepnumber.example.workers.dev)
- Colon-separated API credentials (username:password)
- Bed ID (See Step 5 from [Setup](#setup))
- Which side to set (R or L)
- The Sleep Number

Then, visit https://routinehub.co/shortcut/11471/ and add your values when prompted. You'll have to run the shortcut manually the first time to grant permissions to visit your worker.  

If you'd like to run the shortcut whenever Wind Down starts or at a specific time, see [Setup Automation](#setup-automation) below.

#### Wake Up Time
Duplicate the shortcut created above by 3d pressing it on the home screen and click Duplicate. Then, update the icon and name by clicking the three dots (...) and tapping either the icon or the name to update them. Do this to avoid confusion.  

Then, scroll down to the section titled "Text" storing your sleep number from before and set it to 100. Now you're ready to setup Automation.

#### Setup Automation
On the Shortcuts app home page, select "Automation" at the bottom. Click the +, then "Create Personal Automation". Select whichever critera you wish. I take advantage of the Health app's Sleep feature, which puts my phone into Do Not Disturb n hours before I need to wake up and sets an alarm.  

Whichever option you select, there will be a search bar at the bottom. Type and click the "Run Shortcut" option. Once added, click the placeholder "Shortcut" and select your Bed Time shortcut. ![example](https://tugboat.dev/3h2m04.jpeg)
Click "Next", and turn off "Ask Before Running". Unless you want it to ask, do whatever you want.

Repeat these steps for your Wake Up Time shortcut, except this time I suggest toggling "Ask Before Running" so you can reset your side to 100 when you're ready in the morning.

## API Usage

### Authentication
To access the API, you must provide Basic authentication, the username and password being those configured above.

## Structures

### IDs
IDs are usually negative BigInts. For example, `-9271729034320362272`.

### Bed
|Key|Type|Description|
|-|-|-|
|bedId|[ID](#ids)|the id of the bed
|registration_date|iso8601 string|the date the bed was registered w/ SleepNumber|
|sleeperRightId|[ID](#ids)|the id of the sleeper on the right|
|sleeperLeftId|[ID](#ids)|the id of the sleeper on the right|
|returnRequestStatus|int|unknown|
|size|string|the size of the bed (e.g: "QUEEN", "KING)|
|name|string|the bed name|
|serial|string|the bed serial number|
|isKidsBed|boolean|whether or not the bed is intended for kids|
|dualSleep|boolean|if the bed is intended for two sleepers|
|status|int|unknown|
|version|string|unknown|
|accountId|[ID](#ids)|the id of the account that owns the bed|
|timezone|IANA timezone string|timezone where bed is registered|
|generation|string|unknown|
|model|string|the bed model|
|purchaseDate|iso8601 string|the date the bed was purchased|
|macAddress|string|the mac address of the bed|
|sku|string|the stock-keeping unit value|
|zipcode|string|the zip code the bed was delivered to|
|reverence|string|unknown|
|bed_id|string|the id of the bed to update|

### Routes

#### **`GET`** `/api/beds`
__Response__  

**Type**: `string`  
__Values__
- `Adjusting the {right|left} side to {value}.`
- `Failed to adjust the {right|left} side to {value}.`

#### **`POST`** `/api/sleepnumber`

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
