var webdriver = require("selenium-webdriver"),
    By = webdriver.By,
    until = webdriver.until;

var assert = require("assert");
var driver = new webdriver.Builder().forBrowser("chrome").build();
driver.manage().window().maximize();

const username = 'guest@example.com'
const password = 'Password'
const FilesPage = 'http://qaexercise.envalfresco.com/files'
const FolderName = 'ElyohaAr'
var assert = require('assert');

async function Login()
{
  let btnLogin = By.id('login-button');
  let inpUsername = By.id('username');
  let inpPassword = By.id('password');

  await driver.wait(until.elementLocated(inpUsername), 10 * 1000);
  // Enter credentials and log in
  await driver.findElement(inpUsername).sendKeys(username);
  await driver.findElement(inpPassword).sendKeys(password);
  await driver.findElement(btnLogin).click();
}

async function GoToFiles()
{
  let UserLoginConfirmed = By.id('adf-userinfo-ecm-name-display');
  //wait until page is loaded
  await driver.wait(until.elementLocated(UserLoginConfirmed));

  //go to filesPage
  await driver.get(FilesPage);
  await driver.wait(until.elementLocated(UserLoginConfirmed));
}

async function CreateNewFolder( Name)
{
  let createNewFolder = By.xpath("//span[(text()=' Create ')]");
  let inputFolderName = By.id('adf-folder-name-input');

  await driver.wait(until.elementLocated(By.xpath('//*[@id="document-list-container"]/adf-upload-drag-area/div/adf-toolbar/mat-toolbar/div/button[2]/span/mat-icon'))).click();
  await driver.wait(until.elementLocated(inputFolderName),10000).sendKeys(Name);
  await driver.findElement(createNewFolder).click();
}

async function DeleteCreatedFolder()
{
  let DeleteButton = By.xpath("//button//span[contains(text(),'Delete')]");
  let FolderCreated = By.xpath("//*[contains(text(),'ElyohaAr')]")
  let folderDropDown2 = By.xpath("//adf-datatable//adf-datatable-row[contains(@aria-selected,'true')]//button[contains(@title,'Content')]");

  await driver.findElement(FolderCreated).click();
  (await driver).sleep(200);
 
  driver.wait(until.elementLocated(By.xpath("//adf-datatable//adf-datatable-row[contains(@aria-selected,'true')]//button[contains(@title,'Content')]"))).click();
  await driver.wait(until.elementLocated(DeleteButton), 5000).click();
}

async function CheckThatErrorIsReceived()
{
  driver.wait(until.elementLocated(By.css('simple-snack-bar span')),3000).getText().then(function (text) 
  {
    assert.equal(text, "There's already a folder with this name. Try a different name.")
});
  
}

async function SelectEMCOption()
{
  let optionsDropdown = By.css('.mat-select-arrow-wrapper');
  let ECMoption = By.css('#mat-option-1 > .mat-option-text');
  await driver.findElement(optionsDropdown).click();
  await driver.findElement(ECMoption).click();
 
  await driver.findElement(By.id('host-button')).click();
}

async function example()
{
  let CancelButton = By.xpath("//span[(text()=' Cancel ')]");
  let FolderCreated = By.xpath("//*[contains(text(),'ElyohaAr')]")

  await driver.get("http://qaexercise.envalfresco.com/settings");      
  await driver.wait(until.elementLocated(By.id('host-button')), 10 * 1000);
 
  SelectEMCOption();
  Login();

  GoToFiles();
    
  CreateNewFolder(FolderName);
  await driver.wait(until.elementLocated(FolderCreated));

  CreateNewFolder(FolderName);
  
  CheckThatErrorIsReceived();
  await driver.wait(until.elementLocated((CancelButton),5000)).click(); 

  DeleteCreatedFolder();
  
}


example();
