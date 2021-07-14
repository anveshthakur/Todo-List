const { assert } = require("chai");

const TodoList = artifacts.require('./TodoList.sol');

contract('TodoList', (accounts) => {
    before(async() => {
        this.todoList = await TodoList.deployed()
    })

    it('deploys successfully', async () => {
    const address = await this.todoList.address
    assert.notEqual(address, 0x0)
    assert.notEqual(address, '')
    assert.notEqual(address, null)
    assert.notEqual(address, undefined)
  })

  it('lists tasks', async() => {
      const taskCount = await this.todoList.taskCount();
      const task = await this.todoList.Tasks(taskCount);
      assert.equal(task.id.toNumber(), taskCount.toNumber());
      assert.equal(task.content, 'Inital Task');
      assert.equal(task.complete, false);
      assert.equal(taskCount.toNumber(), 1);
  })

  it('creates tasks', async() => {
      const result = await this.todoList.createTasks("Test Task");
      const taskCount = await this.todoList.taskCount();
      assert.equal(taskCount, 2);
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), taskCount);
      assert.equal(event.content, 'Test Task');
      assert.equal(event.completed, false);
  })

  it('Toggles complete', async() => {
      const result = await this.todoList.toggleComplete(1);
      const task = await this.todoList.Tasks(1);
      assert.equal(task.complete, true);
      const event = result.logs[0].args;
      assert.equal(event.complete, true);
      assert.equal(event.id, 1);
  })
})