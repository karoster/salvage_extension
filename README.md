# Parts Pal
This is a browser extension (and API for storage) that helps the user price out the parts of a motorvehicle. You can install and use the extension [here](https://chrome.google.com/webstore/detail/parts-pal/baijfglmbplogjkgehnhmgpbdeihcega?hl=en), or you can use this code as bones to your own project and deploy the API on heroku.

## Installing the extension 'manually'
If you found parts pal here and you can't find it on the chrome extension store, you can still install the extension.
Simply download the [extension folder](https://github.com/karoster/salvage_extension/tree/master/extension), navigate to chrome://extensions, turn on developer mode, click 'load unpacked' and select the downloaded folder.

## Motivation
Many websites allow you to bid on salvaged vehicles. The buyer often then takes these vehicles apart and sells the working parts individually, resulting in a considerable profit. But with so many different types of vehicles, how can one be expected to know the price of every part?  Consequently, how can one be expected to know what to pay for the salvage title in the first place? Parts Pal leverages Ebay's extensive historical data to allow users to get an upper-bound on what they should pay for a salvage title. Simply install the extension, navigate to Ebay, search for your parts, and add the parts to your cart to get a total. The cart can be saved and reloaded later. Parts Pal aims to save the user considerable time and money by tracking the parts for the users and by using Ebay's data set, which allows the extension to be free (as opposed to paid services with similar and admittedly more functionality like [Pinnacle](https://www.cccis.com/parts-suppliers/recycler-solutions/)).

## Instructions
Parts Pal is pretty intuitive to use, but here are step by step instructions:
1. [install the extension](https://chrome.google.com/webstore/detail/parts-pal/baijfglmbplogjkgehnhmgpbdeihcega?hl=en)

2. restart chrome

3. navigate to Ebay

4. search for the item you want to price
    - recommended:
    if you wish to get an upper bound on a motorcycle
    search "**make** **model** **year** OEM", where bold fields are replaced with the specs for the 
    specific motorcycle. Then select sold listings, as this reflects the most 
    reasonable prices, select price highest first as this is where the majority of 
    the money from the salvage parts will come from.

5. click the extension icon (top right in screenshot)

6. turn the extension on (toggle slider in screenshot, just below extension icon)

7. add the parts of the motorcycle to the extension cart to get an estimate by clicking the buttons added to each listing

8. you may remove items from the cart by either clicking on the item in the cart, or clicking the add to cart button a second time

9. the extension saves its state, so you can perform multiple searches and the cart 
   will not clear

10. you can save the cart to continue to work on later, or if you are buying a bike 
   you have priced out in the past, just click the "save" button in the extension 
   sidebar. It will generate a key corresponding to the cart you have built, put this 
   key in a document along with the **make** **model** **year** of the vehicle you priced 
   to save even more time in the future.

11. You can load bikes via the load bar at the bottom of the sidebar extension. Just 
  paste a key in from a previously saved cart

If you are running into issues, it may be because you are signed into a chrome account that has privacy settings that conflict with the settings of the extension. Try uninstalling, signing out of your chrome account, and reinstalling the extension.


