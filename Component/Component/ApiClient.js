import * as ApiClient from './ApiClient';


export const BASE_URL = 'https://www.cartpedal.com/';

const add_product = 'api-product/add-product';


export async function saveProduct(productDetail){
  console.log("saveProduct ---> ")
  let url = add_product;
  let responce = await postMultipart(url,productDetail);  
  return responce;
}


// GET PU Basic method
export async function get(url) {
    console.log("Get Request --->")
    console.log(BASE_URL+url)

   let response;
      await fetch(BASE_URL+url)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('responseJson -> ')
        console.log(responseJson)
        response = responseJson;
      })
      .catch((error) => {
        console.error(error);
      });

    return response; 
  }

  export async function postMultipart(url,body)
  {
    let responseJson;

 await   fetch(BASE_URL+url, {
      method: 'Post',
      headers: new Headers({
        'Content-Type': 'multipart/form-data',
        device_id: '1111',
        device_token: '1111',
        device_type: 'android',
        // Authorization: 'Bearer' + this.state.access_token,  
        Authorization: 'Bearer xriPJWJGsQT-dUgP4qH11EMM357_kEaan7zJ4Vty'

      }),
      body: body,
    })

      .then(response => response.json())
      .then(response => {
        responseData = response;
      })
      .catch(error => {
        this.hideLoading();
        console.error(error)
      })

      .done()
    console.log("Api Request ----->>> " +(BASE_URL+url))
    console.log(body)

    console.log("Api Responce ----->>> ")
    console.log(responseJson)

    responseJson = responseJson.json()

    return responseJson;

  }
  export async function post(url,body) {
    let responseJson;
    responseJson = await fetch(BASE_URL+url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    console.log("Api Request ----->>> " +url)
    console.log(body)

    console.log("Api Responce ----->>> ")
    console.log(responseJson)

    responseJson = responseJson.json()

    return responseJson;
  }

export async function postWithfile(url,photoUri) {
    let responseJson;
    const data = new FormData();
    data.append('photo', photoUri);

    let options = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      method: 'POST'
    };
    options.body = data;

    console.log("Api Request ----->>> " +BASE_URL+url)
    console.log(data)

    responseJson = await fetch(BASE_URL+url, options);

    console.log("Api Responce ----->>> ")
    console.log(responseJson)

    responseJson = responseJson.json()

    return responseJson;
  }

