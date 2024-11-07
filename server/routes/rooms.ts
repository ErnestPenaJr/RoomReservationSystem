import { Router } from 'express';
import { executeQuery } from '../db';
import { Room } from '../../src/types';

const router = Router();

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const sql = `
      SELECT 
        id, name, capacity, floor, building,
        image_url as "imageUrl",
        amenities,
        status
      FROM rooms
      ORDER BY name
    `;

    const rooms = await executeQuery<Room>(sql);
    res.json(rooms);
  } catch (err) {
    console.error('Error fetching rooms:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add new room
router.post('/', async (req, res) => {
  const { name, capacity, floor, building, imageUrl, amenities } = req.body;

  try {
    const sql = `
      INSERT INTO rooms (
        id, name, capacity, floor, building, image_url, amenities, status
      ) VALUES (
        room_id_seq.NEXTVAL, :name, :capacity, :floor, :building, :imageUrl,
        :amenities, 'available'
      ) RETURNING id INTO :id
    `;

    await executeQuery(sql, [
      name,
      capacity,
      floor,
      building,
      imageUrl,
      JSON.stringify(amenities)
    ]);

    res.status(201).json({ message: 'Room created successfully' });
  } catch (err) {
    console.error('Error creating room:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update room
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, capacity, floor, building, imageUrl, amenities, status } = req.body;

  try {
    const sql = `
      UPDATE rooms SET
        name = :name,
        capacity = :capacity,
        floor = :floor,
        building = :building,
        image_url = :imageUrl,
        amenities = :amenities,
        status = :status
      WHERE id = :id
    `;

    await executeQuery(sql, [
      name,
      capacity,
      floor,
      building,
      imageUrl,
      JSON.stringify(amenities),
      status,
      id
    ]);

    res.json({ message: 'Room updated successfully' });
  } catch (err) {
    console.error('Error updating room:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete room
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await executeQuery('DELETE FROM rooms WHERE id = :id', [id]);
    res.json({ message: 'Room deleted successfully' });
  } catch (err) {
    console.error('Error deleting room:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export const roomsRouter = router;