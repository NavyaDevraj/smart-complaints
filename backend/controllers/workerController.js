const db = require('../config/db');

exports.getAvailableWorkers = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT w.id, u.name, u.email, w.department 
       FROM workers w JOIN users u ON w.user_id = u.id 
       WHERE w.is_available = true`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyAssignedComplaints = async (req, res) => {
  try {
    const [worker] = await db.query(
      'SELECT id FROM workers WHERE user_id = ?', [req.user.id]
    );
    const [rows] = await db.query(
      `SELECT c.*, cat.name as category FROM complaints c
       JOIN categories cat ON c.category_id = cat.id
       WHERE c.assigned_worker_id = ? ORDER BY c.created_at DESC`,
      [worker[0].id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};