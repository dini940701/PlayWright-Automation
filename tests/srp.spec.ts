import {test, expect } from '../Fixtures/baseFixtures.js';

const search=[
    {searchkey:'macbook',productname:'MacBook Pro'},
    {searchkey:'Samsung',productname:'Samsung Galaxy Tab 10.1'}
];

for(const productSearch of search){
test(`Verify the slecting the product : ${productSearch.searchkey}`,async({homePage})=>{
    const srp=await homePage.doSearch(productSearch.searchkey);
    const pdp=await srp.selectProduct(productSearch.productname);
    expect(await pdp.getProductHeader()).toContain(productSearch.productname);
});
}
