# Machine-Learning-Skin-Lesions-Classification-using-Tensorflow-Javascript-v1.1
 This repo includes all the the files necessary for classifying skin lesions. MobileNet Model was pre-trained on HAM10000 image library, with having a top 3 predicitons from the seven trained classes. This project runs only on the front-end, fully functioning in terms of predection only.


This repo includes all the files necessary for running the project. To use it, run the following command in the terminal:
#### npm install

To run on local server (please check port number from bin/www), run the following command:
#### npm start

Then, open on a local server port 3000.

Once you open the local server, wait for a while for the model to load and auto-predict the shown image, then you can upload any image for prediction. It only predict 
out of 7 skin classes which are only trained on, and will be improved later to detect non-cancerous skin cases. Sample images can be found in the image folder for testing
and predecting.
