/*

Description & Notes:
______________________________________________________________________________________________________
1- This file will run immedietly once the user opens the web page. It is mainly for demonestrating 
how the model works but automatically uploading a sample image, classify it and show a result to
the user. This file will only run once at the first time the user opens the page.

2- The model will be loaded automatically, which could take up to 3 seconds for the first automated 
prediction, then it will not take seconds for any other prediction.

3- This file will call a function "model_processArray()" from patch_prediction_code.js file, making
any other classification done from that file after the first automated classification mention in (1).

4- The model files in the "tfjs_dir_Skin_Lesion_Model" folder are uploaded on S3 storage, refere to
KK for updating those files. Then they are loaded to the model using: 
"https://doccampaign.s3-ap-southeast-1.amazonaws.com/AI/model.json"

5- The model images have resolution of 96x96, size of (width x height) 224x224 pixels, thus there is
a pre-processing block for processing uploaded images from the user.

6- "predict()" method takes and returns a tensor. "data()" loads the values of the output tensor and
returns a promise of a typed array when the computation is complete. Notice the await and async keywords
are used together.


Table of Contents:
______________________________________________________________________________________________________
// 1.0) LOADING THE MODEL IMMEDIATELY WHEN THE PAGE LOADS
// 1.1) Defining 2 helper functions
// 1.2) Simulate a click on the predict button
// 1.3) Load the model from server
// 1.4) Load the sample image to the model for automated classification.
// 1.5) Simulate a click on the predict button.

// 2.0) MAKE A PREDICTION ON THE FRONT PAGE IMAGE WHEN THE PAGE LOADS
// 2.1) Pre-processing loaded images and putting them into tensor variable
// 2.3) Starting Prediction on the tensor
// 2.4) Prediction Array
// 2.4.1) Creating an array map
// 2.4.2) Sorting and slicing the prediction array to 1 prediction
// 2.4.3) Appending the prediction array into the <li>

// 3.0) LOAD IMAGES FROM USER TO BE PASSED TO THE "app_batch_prediction_code.js"
// 3.1) Pass the image to be predicted


_______________________________________________________________________________________________________
*/

// const tf =  require('@tensorflow/tfjs-node');


// 1.0) LOADING THE MODEL IMMEDIATELY WHEN THE PAGE LOADS
// 1.1) Defining 2 helper functions

function simulateClick(tabID) {
    document.getElementById(tabID).click();
}

function predictOnLoad() {
    // 1.2) Simulate a click on the predict button
    setTimeout(simulateClick.bind(null, 'predict-button'), 500);
}

// 1.3) Load the model from server
let model;
(async function() {
    console.log("before loading the model", model)
    model = await tf.loadLayersModel('https://doccampaign.s3-ap-southeast-1.amazonaws.com/AI/model.json');
    console.log("after loading the model", model)
    // 1.4) Load the sample image to the model for automated classification.
    $("#selected-image").attr("src", "/images/samplepic.jpg");

    // 1.5) Simulate a click on the predict button.
    predictOnLoad();

})();

// 2.0) MAKE A PREDICTION ON THE FRONT PAGE IMAGE WHEN THE PAGE LOADS
$("#predict-button").click(async function() {
    let image = undefined;
    image = $('#selected-image').get(0);

    // 2.1) Pre-processing loaded images and putting them into tensor variable
	let tensor = tf.browser.fromPixels(image)
		.resizeNearestNeighbor([224, 224])
		.toFloat();

    let offset = tf.scalar(127.5);
	tensor = tensor.sub(offset)
		.div(offset)
		.expandDims();

	// 2.3) Starting Prediction on the tensor
    let predictions = await model.predict(tensor).data();
	console.log("prediction", predictions)
	
	// 2.4) Prediction Array
	// 2.4.1) Creating an array map
	let top3 = Array.from(predictions)
        .map(function(p, i) { // this is Array.map
            return {
                probability: p,
                className: TARGET_CLASSES[i]
			};
		// 2.4.2) Sorting and slicing the prediction array to 1 prediction
        }).sort(function(a, b) {
            return b.probability - a.probability;

        }).slice(0, 1);

	// 2.4.3) Appending the prediction array into the <li>
    top3.forEach(function(p) {

        // ist-style-type:none removes the numbers.
        // https://www.w3schools.com/html/html_lists.asp
        $("#prediction-list").append(`<li style="list-style-type:none;">${p.className}: ${p.probability.toFixed(3)}</li>`);
    });
});

// 3.0) LOAD IMAGES FROM USER TO BE PASSED TO THE "app_batch_prediction_code.js"
// This listens for a change. It fires when the user submits images.
$("#image-selector").change(async function() {
    // the FileReader reads one image at a time
	fileList = $("#image-selector").prop('files');
	
	//$("#prediction-list").empty();
	
	// Start predicting
	// This function is in the app_batch_prediction_code.js file.
	model_processArray(fileList);
});
