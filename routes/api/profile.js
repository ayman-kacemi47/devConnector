const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {
  check,
  ExpressValidator,
  validationResult,
} = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

const request = require('request');
const config = require('config');

// @route GET api/profile/me
// @desc    get current users profile
// @access Private //wa9ila dyal lmconnecter ?

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route post api/profile/
// @desc    Crete or update a user profile
// @access Private //wa9ila dyal lmconnecter ?
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }

    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        //update because profile already exist
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ); // ? $set and new true
        return res.json(profile);
      }

      //if not so Create profile
      profile = new Profile(profileFields);
      await profile.save(); // save is ont the instance and not on the Module
      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route GET api/profile
// @desc    get all profiles
// @access Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']); // populate('collectionName',['field1','Field2', ....])
    res.json(profiles);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route GET api/profile/user/:user_id
// @desc    get all profiles
// @access Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).send('No profile Found');
    }
    res.json(profile);
  } catch (err) {
    if (err.kind == 'ObjectId') {
      return res.status(400).send('No profile Found');
    }
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route  delete api/profile
// @desc delete the profile of user => delete user & user posts
// @access private

router.delete('/', auth, async (req, res) => {
  try {
    //REMOVE USER POSTS
    await Post.deleteMany({ user: req.user.id });

    //REMOVE PROFILE
    await Profile.findOneAndDelete({ user: req.user.id });

    // REMOVE USER
    await User.findOneAndDelete({ _id: req.user.id });
    res.json({ msg: 'Profile deleted' });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @router put api/profile/experience
// @desc add or update profile experience
// @acess PRIVATE

router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is Required').not().isEmpty(),
      check('company', 'Company is Required').not().isEmpty(),
      check('from', 'From date is Required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, company, location, from, to, current, descrition } =
      req.body;
    myExp = {
      // just to conatain so we can usit in unshift ?
      title, // actaully it's title : title , maybe because they had the same name
      company,
      location,
      from,
      to,
      current,
      descrition,
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(myExp);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @router delete /api/profile/experience/:exp_id
// @desc delete a experience from profile experiences
// @access private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    //Get remove index .  indexOf() is a method for arrays. return the index of a value in a array
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id); //profile avec p et non P : parceque on veut boucler sur les exeperiences d'un utilisateur specifique.

    //bug if index = -1 it will delete the last element , we don't want that
    if (removeIndex == -1)
      return res.status(400).send('Element to delete not found');
    profile.experience.splice(removeIndex, 1); // array.splice(start, deleteCount, item1, item2, ...) , si on met item1 , ... il v's ajouter les elements apartir d'index start et supprime si delectcount > 0
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

// @router PUT /api/profile/education
// @DESC add a education
// @acess Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required').not().isEmpty(),
      check('degree', 'Degree is required').not().isEmpty(),
      check('fieldofstudy', 'Field of study is required').not().isEmpty(),
      check('from', 'From data is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body;

    const myEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(myEdu);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @router api/profile/education/:edu_id
// @desc delete a education based on params id
// @access private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);
    //bug if index = -1 it will delete the last element , we don't want that
    if (removeIndex == -1)
      return res.status(400).send('Element to delete not found');
    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;

// @router GET api/profile/github/:username
// @desc get a user repos from github
// @access PUBLIC
router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClientId'
      )}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };

    request(options, (error, response, body) => {
      if (error) console.log(error);
      if (response.statusCode !== 200)
        return res.status(400).send('No github profile found');

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});
