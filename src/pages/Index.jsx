import React, { useState, useEffect } from "react";
import { Box, Button, Checkbox, Flex, FormControl, FormLabel, Heading, Input, Select, Stack, Text, useToast, VStack } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const Index = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("Personal");
  const [filter, setFilter] = useState("All");
  const [editId, setEditId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (!input) {
      toast({
        title: "No task entered",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    const newTask = {
      id: Date.now(),
      text: input,
      category,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setInput("");
    setCategory("Personal");
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleComplete = (id) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const handleEdit = (id) => {
    const task = tasks.find((task) => task.id === id);
    setInput(task.text);
    setCategory(task.category);
    setEditId(id);
  };

  const handleUpdateTask = () => {
    setTasks(tasks.map((task) => (task.id === editId ? { ...task, text: input, category } : task)));
    setInput("");
    setCategory("Personal");
    setEditId(null);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "All") return true;
    if (filter === "Completed") return task.completed;
    if (filter === "Incomplete") return !task.completed;
    return task.category === filter;
  });

  return (
    <VStack p={5}>
      <Heading mb="8">Todo App</Heading>
      <FormControl>
        <FormLabel htmlFor="task">Task</FormLabel>
        <Input id="task" placeholder="Add a new task" value={input} onChange={(e) => setInput(e.target.value)} />
      </FormControl>
      <Select placeholder="Select category" value={category} onChange={(e) => setCategory(e.target.value)} mt={4}>
        <option value="Personal">Personal</option>
        <option value="Work">Work</option>
      </Select>
      <Button leftIcon={<FaPlus />} colorScheme="blue" mt={4} onClick={editId ? handleUpdateTask : handleAddTask}>
        {editId ? "Update Task" : "Add Task"}
      </Button>
      <Select placeholder="Filter tasks" value={filter} onChange={(e) => setFilter(e.target.value)} mt={4}>
        <option value="All">All</option>
        <option value="Completed">Completed</option>
        <option value="Incomplete">Incomplete</option>
        <option value="Personal">Personal</option>
        <option value="Work">Work</option>
      </Select>
      <Box w="100%" mt={8}>
        {filteredTasks.map((task) => (
          <Flex key={task.id} align="center" justify="space-between" p={2} borderWidth="1px" borderRadius="lg">
            <Checkbox isChecked={task.completed} onChange={() => handleComplete(task.id)}>
              {task.text} ({task.category})
            </Checkbox>
            <Box>
              <Button size="sm" onClick={() => handleEdit(task.id)} mr={2}>
                <FaEdit />
              </Button>
              <Button size="sm" colorScheme="red" onClick={() => handleDelete(task.id)}>
                <FaTrash />
              </Button>
            </Box>
          </Flex>
        ))}
      </Box>
    </VStack>
  );
};

export default Index;
