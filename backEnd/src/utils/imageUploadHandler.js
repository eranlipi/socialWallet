const multer = require('multer');

// imageName: field name, idField: 'userID' (default) or 'businessID'
function handleImageUpload(imageName, idField = 'userID') {
    const storage = multer.diskStorage({
        destination: idField === 'businessID' ? 'uploads/business/' : 'uploads/',
        filename: function (req, file, callBack) {
            const name = idField === 'businessID' ? req.user.businessID : req.user.userID;
            callBack(null, name);
        }
    });

    const upload = multer({ storage }).single(imageName);
    const responseCreator = require("../utils/responseCreator");
    return (req, res) => {
        upload(req, res, (error) => {
            if (error)
                return res
                    .status(400)
                    .send(responseCreator("error", "Request can't be proceed"));
            else
                res
                    .status(200)
                    .send(responseCreator("success", "Successfully updated profile image"));
        })
    }
}

module.exports = handleImageUpload
