const User = require('../models/User');


exports.getPurchaseHistory = async (req, res) => {
  const { id } = req.user;

  try {
    const user = await User.findByPk(id, { include: ['purchases'] });
    res.status(200).json(user.purchases);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching purchase history' });
  }
};