import fetch from "node-fetch";
  
  // Your PAT (Personal Access Token) can be found in the portal under Authentification
  const MODEL_ID = "face-detection";
  // This function creates the JSON body for your request

  const requestOptionsJSON = (imgUrl) => {
    const PAT = "a3cf559c3aea45cc8c8f5c0f7c9ee95d";
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = "chamil_n13";
    const APP_ID = "test";
    // Change these to whatever model and image URL you want to use
    const IMAGE_URL = imgUrl;

    // Create the JSON body for your prediction
    const raw = JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      inputs: [
        {
          data: {
            image: {
              url: IMAGE_URL,
            },
          },
        },
      ],
    });

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Key ${PAT}`,
      },
      body: raw,
    };
    return requestOptions;
  };

  const handleImgUrl=(req,res)=>{
    const imgUrl=req.body.input;
    console.log(imgUrl)
    fetch(
      `https://api.clarifai.com/v2/models/${MODEL_ID}/outputs`,
      requestOptionsJSON(imgUrl)
    ) // Make the API call
    .then(response=> response.json()) // Convert response to JSON
    .then(data=> res.json(data)) // convert the data to json to send it 
    .catch(err=>res.status(400).json("unable to work with api"))
  }

const handleImage = (req, res,db) => {
    const { id } = req.body;
    db("users")
      .where("id", "=", id)
      .increment("entries", 1)
      .returning("entries")
      .then((entries) => {
        res.json(entries[0].entries);
      })
      .catch((err) => res.status(400).json("error getting entries"));
  }

  export {handleImage , handleImgUrl}