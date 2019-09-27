// setting api routes below

const router = require("express").Router();
const { Eyeball } = require("../db");
const { promisify } = require("util");
const execFile = promisify(require("child_process").execFile);

// POST /api/eyeballs

router.post("/add", async (req, res, next) => {
  try {
    console.log(
      "REQ BODY #####################################################",
      req.body
    );
    const uploadedEyeball = await Eyeball.create({
      imageUrl: req.body.imageUrl
    });
    console.log(
      "UPLOADED EYEBALL #####################################################",
      uploadedEyeball
    );
    res.send(uploadedEyeball);
  } catch (err) {
    next(err);
  }
});

// GET /api/eyeballs

router.get("/", async (req, res, next) => {
  try {
    const pythonResult = await execFile("python3", ["test.py"]);
    res.send(pythonResult.stdout);
    console.log(
      "pythonResult #################################################",
      pythonResult.stdout
    );
  } catch (err) {
    next(err);
  }
});

// GET /api/eyeballs/:eyeballId
router.get("/:eyeballId", async (req, res, next) => {
  let eyeballId = req.params.eyeballId;
  try {
    const eyeball = await Eyeball.findByPk(eyeballId);
    res.send(eyeball);
  } catch (err) {
    next(err);
  }
});

// PUT /api/eyeballs/:eyeballId

router.put("/:eyeballId", async (req, res, next) => {
  let eyeballId = req.params.eyeballId;
  try {
    const eyeballUpdated = await Eyeball.findById(eyeballId);

    eyeballUpdated.update(req.body);
    res.send(eyeballUpdated);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
