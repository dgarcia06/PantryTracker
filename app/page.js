'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
}

const headerStyle = {
  width: '100%',
  bgcolor: '#008080', // Nice teal color for the header background
  color: 'white',
  padding: 2,
  textAlign: 'center',
  borderRadius: '8px 8px 0 0',
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [editItemName, setEditItemName] = useState('')
  const [editItemQuantity, setEditItemQuantity] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const editItem = (name, quantity) => {
    setEditItemName(name)
    setEditItemQuantity(quantity)
    setEditOpen(true)
  }

  const updateItemQuantity = async () => {
    const docRef = doc(collection(firestore, 'inventory'), editItemName)
    await setDoc(docRef, { quantity: parseInt(editItemQuantity) })
    await updateInventory()
    setEditOpen(false)
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleEditClose = () => setEditOpen(false)

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      bgcolor="#E0F7FA" // Cool light cyan background color
      p={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-title" variant="h6" component="h2">
            Add New Item
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              id="item-name"
              label="Item Name"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Modal
        open={editOpen}
        onClose={handleEditClose}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="edit-modal-title" variant="h6" component="h2">
            Edit Item Quantity
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              id="edit-item-quantity"
              label="Quantity"
              variant="outlined"
              fullWidth
              value={editItemQuantity}
              onChange={(e) => setEditItemQuantity(e.target.value)}
              type="number"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={updateItemQuantity}
            >
              Update
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Typography variant="h3" sx={{ mb: 2, color: '#008080' }}>
        Inventory Management
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{ mb: 2 }}
      >
        Add New Item
      </Button>
      <TextField
        id="search-field"
        label="Search Items"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Box
        width="100%"
        maxWidth="800px"
        borderRadius="8px"
        overflow="hidden"
        boxShadow={2}
      >
        <Box sx={headerStyle}>
          <Typography variant="h4">Inventory Items</Typography>
        </Box>
        <Stack
          width="100%"
          height="400px"
          spacing={2}
          overflow="auto"
          bgcolor="white"
          p={2}
          sx={{ borderRadius: '0 0 8px 8px' }}
        >
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              bgcolor="#E0FFFF" // Light cyan background for inventory items
              p={2}
              borderRadius="8px"
              boxShadow={1}
              sx={{
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            >
              <Typography variant="h6">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h6">Quantity: {quantity}</Typography>
              <Box display="flex" gap={1}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => removeItem(name)}
                >
                  Remove
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => editItem(name, quantity)}
                >
                  Edit
                </Button>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
