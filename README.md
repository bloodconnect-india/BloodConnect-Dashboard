# Dashboard

Dashboard widget built in react for Zoho creator.

## Installation

Clone and install the required modules.
```bash
git clone https://github.com/bloodconnect-india/BloodConnect-Dashboard
cd BloodConnect-Dashboard
yarn 
```

## Usage

 1. In  src/Constant/index.ts
 ```bash
 change __IS_DEV__  to true // if using locally
 ```
 2.  Start the project
 ```bash
 yarn start        // or npm start
 ```

## Working

 The whole process is divided into a few steps : 
 1. Getting the data ( All the data is fetched in the App.tsx file and passed via props 
     2. Formatting or filtering the data 
     3. Rendering the data

#### 1. Getting the data 
     The camp and volunteer data come from the Zoho [creator widget API](https://www.zoho.com/creator/newhelp/app-settings/widgets/creator-api-for-widgets.html) and the helpline data comes from [API](https://github.com/bloodconnect-india/api) in [this](https://github.com/bloodconnect-india/BloodConnect-Dashboard/blob/master/src/services/index.ts) file. 

#### 2. Filtering/Formatting the data
     Every file has a *filterData* function which filters data according to city or date filer as in the case of StatTable.
      

### Publishing
     Make sure you have make install in your system.

     ``` bash
     // change __IS__DEV__ to false
     make build
     vi docs/index.html 
     // add these 2 lines in the head tag
     <script type="text/javascript" src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
     <script type="text/javascript" src="https://js.zohostatic.com/creator/widgets/version/1.0/widgetsdk-min.js"></script>
     ```

## Contributing
 Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
