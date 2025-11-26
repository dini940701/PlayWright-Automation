import {test, expect } from "../Fixtures/baseFixtures.js";

let search=[
    {searchkey:'macbook',productname:'MacBook Pro'},
    {searchkey:'Samsung',productname:'Samsung Galaxy Tab 10.1'}
]

for(let productSearch of search){
test(`Verify the slecting the product : ${productSearch.searchkey}`,async({homePage})=>{
    let srp=await homePage.doSearch(productSearch.searchkey);
    let pdp=await srp.selectProduct(productSearch.productname);
    expect(await pdp.getProductHeader()).toContain(productSearch.productname)
});
}
