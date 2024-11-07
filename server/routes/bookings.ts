import { Router } from 'express';
import { executeQuery } from '../db';
import { Booking } from '../../src/types';

const router = Router();

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const sql = `
      SELECT 
        id, room_id as "roomId", user_id as "userId",
        TO_CHAR(start_time, 'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"') as "startTime",
        TO_CHAR(end_time, 'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"') as "endTime",
        title, description, status
      FROM bookings
      ORDER BY start_time DESC
    `;

    const bookings = await executeQuery<Booking>(sql);
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add new booking
router.post('/', async (req, res) => {
  const { roomId, userId, startTime, endTime, title, description } = req.body;

  try {
    // Check for conflicts
    const conflicts = await executeQuery(`
      SELECT 1 FROM bookings
      WHERE room_id = :roomId
        AND status != 'rejected'
        AND (
          (start_time BETWEEN TO_TIMESTAMP(:startTime, 'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"')
            AND TO_TIMESTAMP(:endTime, 'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"'))
          OR (end_time BETWEEN TO_TIMESTAMP(:startTime, 'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"')
            AND TO_TIMESTAMP(:endTime, 'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"'))
        )
    `, [roomId, startTime, endTime]);

    if (conflicts.length > 0) {
      return res.status(409).json({ message: 'Time slot already booked' });
    }

    const sql = `
      INSERT INTO bookings (
        id, room_id, user_id, start_time, end_time, title, description, status
      ) VALUES (
        booking_id_seq.NEXTVAL, :roomId, :userId,
        TO_TIMESTAMP(:startTime, 'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"'),
        TO_TIMESTAMP(:endTime, 'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"'),
        :title, :description, 'pending'
      ) RETURNING id INTO :id
    `;

    await executeQuery(sql, [
      roomId,
      userId,
      startTime,
      endTime,
      title,
      description
    ]);

    res.status(201).json({ message: 'Booking created successfully' });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update booking status
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, reason } = req.body;

  try {
    const sql = `
      UPDATE bookings SET
        status = :status,
        denial_reason = :reason
      WHERE id = :id
    `;

    await executeQuery(sql, [status, reason, id]);
    res.json({ message: 'Booking status updated successfully' });
  } catch (err) {
    console.error('Error updating booking status:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export const bookingsRouter = router;