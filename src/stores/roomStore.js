import axios from "axios";
import { makeObservable, observable, action } from "mobx";
import slugify from "react-slugify";

class RoomStore {
  rooms = [
    {
      image:
        "https://mk0peerspaceres622pi.kinstacdn.com/wp-content/uploads/Eco-Friendly-Executive-Boardroom-santa-monica-la-los-angeles-rental-1200x600.jpg",
      id: 1,
      title: "Meeting room",
      description: "Only people invited for the meeting!",
      slug: "meeting-room",
      messages: [
        {
          msg: "Hi Hacker, How are you?",
        },
        {
          msg: "I am fine.",
        },
      ],
    },
  ];

  constructor() {
    makeObservable(this, {
      rooms: observable,
      createRoom: action,
      updateRoom: action,
      deleteRoom: action,
      createMsg: action,
    });
  }

  createRoom = async (room) => {
    room.id = this.rooms[this.rooms.length - 1].id + 1;
    room.slug = slugify(room.title);
    this.rooms.push(room);

    try {
      const response = await axios.post(
        "http://coded-task-axios-be.herokuapp.com/rooms",
        room
      );
      // this.room = response.data
    } catch (error) {
      console.error(error);
    }
  };

  fetchRooms = async () => {
    try {
      const response = await axios.get(
        "https://coded-task-axios-be.herokuapp.com/rooms"
      );

      this.rooms = response.data;
      console.log("responsoe//////", response);
    } catch (error) {
      console.error(error);
    }
  };

  deleteRoom = async (roomId) => {
    this.rooms = this.rooms.filter((room) => room.id !== roomId);
    try {
      const response = await axios.delete(
        `https://coded-task-axios-be.herokuapp.com/rooms/${roomId}`,
        roomId
      );
      this.rooms = response.data;
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  createMsg = (roomId, msg) => {
    const room = this.rooms.find((_room) => _room.id === +roomId);
    room.messages.push(msg);
  };

  updateRoom = (updatedRoom) => {
    try {
      const room = this.rooms.find((room) => room.id === updatedRoom.id);
      room.title = updatedRoom.title;
      room.description = updatedRoom.description;
      room.image = updatedRoom.image;
      axios.put(
        `https://coded-task-axios-be.herokuapp.com/rooms/${updatedRoom.id}`,
        updatedRoom
      );
    } catch (error) {
      console.error(error);
    }
  };
}

const roomStore = new RoomStore();
roomStore.fetchRooms();
export default roomStore;
