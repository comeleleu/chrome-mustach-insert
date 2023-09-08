chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    let imageUrl = details.url

    //Vérificateur fictif, remplacer la détection de visages
    if (imageUrl == "https://libeo.com/wp-content/uploads/2021/09/alexandre_limoges_libeo-333x460-c-default.jpg") {
      console.log(imageUrl);
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      
      var raw = JSON.stringify({
        "key": "DSZQGGaPcb3HdpexWRvxkP7rN7GrLIcwr6RErIW9AzLL7ezVQrS1r0clJd9g",
        "prompt": "Add a mustach on faces",
        "negative_prompt": null,
        "init_image": imageUrl,
        "width": "512",
        "height": "512",
        "samples": "1",
        "num_inference_steps": "30",
        "safety_checker": "no",
        "enhance_prompt": "yes",
        "guidance_scale": 7,
        "strength": 0.4,
        "seed": null,
        "webhook": null,
        "track_id": null
      });
      
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      
      // var newImageUrl = fetch("https://stablediffusionapi.com/api/v3/img2img", requestOptions)
      //   .then(response => response.text())
      //   .then(result => {
      //     let json = JSON.parse(result);
      //     console.log(json);
      //     return json.output[0];
      //   })
      //   .catch(error => console.log('error', error));

      var newImageUrl = fetch("https://stablediffusionapi.com/api/v3/img2img", requestOptions)
        .then((response) => {
          if(response.ok) {
            return response.json();
          } else {
            throw new Error('Server response wasn\'t OK');
          }
        })
        .then((json) => {
          return json.output;
        });      

      // let response = fetch("https://stablediffusionapi.com/api/v3/img2img", requestOptions);
      // let data = response.text();
      console.log(newImageUrl);

      // var json = JSON.parse('{"status":"success","generationTime":1.5412416458129883,"id":41082257,"output":["https://cdn2.stablediffusionapi.com/generations/405bde1a-76b8-415c-940a-4d7fd978b6a6-0.png"],"meta":{"H":512,"W":512,"file_prefix":"29a9924b-8017-49a4-8d8d-0a4c05752ea4","guidance_scale":2,"init_image":"https:\/\/libeo.com\/wp-content\/uploads\/2021\/09\/alexandre_limoges_libeo-333x460-c-default.jpg","n_samples":1,"negative_prompt":"(child:1.5), ((((underage)))), ((((child)))), (((kid))), (((preteen))), (teen:1.5) ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, extra limbs, disfigured, deformed, body out of frame, bad anatomy, watermark, signature, cut off, low contrast, underexposed, overexposed, bad art, beginner, amateur, distorted face, blurry, draft, grainy","outdir":"out","prompt":"Add a mustach on faces hyperrealistic, full body, detailed clothing, highly detailed, cinematic lighting, stunningly beautiful, intricate, sharp focus, f\/1. 8, 85mm, (centered image composition), (professionally color graded), ((bright soft diffused light)), volumetric fog, trending on instagram, trending on tumblr, HDR 4K, 8K","safetychecker":"yes","seed":3484292580,"steps":20,"strength":0.5}}');

      return {redirectUrl: newImageUrl}
    }

    return {redirectUrl: imageUrl}
  },

  {
    urls: ["<all_urls>"],
    types: ["image"],
  },
  ["blocking", "requestBody", "extraHeaders"]
)