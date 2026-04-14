const db = require('../config/db');

exports.createComplaint = async (req, res) => {
  const { title, description, location, category_id } = req.body;
  const citizen_id = req.user.id;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    await db.query(
      'INSERT INTO complaints (citizen_id, category_id, title, description, location, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [citizen_id, category_id, title, description, location, image_url]
    );
    res.status(201).json({ message: 'Complaint filed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyComplaints = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.*, cat.name as category, u.name as worker_name 
       FROM complaints c 
       JOIN categories cat ON c.category_id = cat.id
       LEFT JOIN workers w ON c.assigned_worker_id = w.id
       LEFT JOIN users u ON w.user_id = u.id
       WHERE c.citizen_id = ? ORDER BY c.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.*, cat.name as category, u.name as citizen_name,
       wu.name as worker_name
       FROM complaints c 
       JOIN categories cat ON c.category_id = cat.id
       JOIN users u ON c.citizen_id = u.id
       LEFT JOIN workers w ON c.assigned_worker_id = w.id
       LEFT JOIN users wu ON w.user_id = wu.id
       ORDER BY c.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.assignWorker = async (req, res) => {
  const { complaint_id, worker_id } = req.body;
  try {
    await db.query(
      'UPDATE complaints SET assigned_worker_id = ?, status = "assigned" WHERE id = ?',
      [worker_id, complaint_id]
    );
    await db.query(
      'INSERT INTO status_history (complaint_id, changed_by, old_status, new_status, remarks) VALUES (?, ?, "pending", "assigned", "Worker assigned")',
      [complaint_id, req.user.id]
    );
    res.json({ message: 'Worker assigned' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  const { complaint_id, status, remarks } = req.body;
  try {
    const [old] = await db.query('SELECT status FROM complaints WHERE id = ?', [complaint_id]);
    await db.query('UPDATE complaints SET status = ? WHERE id = ?', [status, complaint_id]);
    await db.query(
      'INSERT INTO status_history (complaint_id, changed_by, old_status, new_status, remarks) VALUES (?, ?, ?, ?, ?)',
      [complaint_id, req.user.id, old[0].status, status, remarks]
    );
    res.json({ message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};