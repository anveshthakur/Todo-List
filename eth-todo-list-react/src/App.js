import React, { Component } from 'react'
import Web3 from 'web3';
import'./App.css';
import TodoList from './abi/TodoList.json';

export default class App extends Component {
    componentWillMount(){
        this.loadWeb3();
        this.loadBlockchainData();
    }

    constructor(props) {
        super(props)
        this.state = { account: '' , tasks : [], content: ''}
    }

    loadWeb3 = async() => {
        if(window.ethereum){
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable();
        }
        else if(window.web3) window.web3 = new Web3(window.currentProvider);
        else window.alert('Non-Etherium browser detected. You Should consider using MetaMask !')
    }

    loadBlockchainData = async() =>{
            const web3 = window.web3;
            const accounts = await web3.eth.getAccounts()
            this.setState({account: accounts[0]})
            this.setState({loading: true})


            const networkId = await web3.eth.net.getId();
            const networkData = TodoList.networks[networkId];
            
            if(networkData){
                const todoList = new web3.eth.Contract(TodoList.abi, networkData.address);
                this.setState({todoList});
                const taskCount = await todoList.methods.taskCount().call();
                this.setState({taskCount});
                for(let i = 1; i <= taskCount; i++){
                    const task = await todoList.methods.Tasks(i).call()
                    console.log(task)
                    this.setState({
                        tasks: [...this.state.tasks, task]
                    })
                }
            }
            this.setState({loading: true})
        }

    refreshPage = () => {
        window.location.reload();
    }    

    createTask = () => {
        this.setState({loading: true})
        this.state.todoList.methods.createTasks(this.state.content).send({from: this.state.account}).once('reciept', (receipt) => {
            this.setState({loading: false})
        })
        this.setState({content: ''})
    }

    toggleCompleted = async (taskId) => {
        this.setState({loading: true})
        this.state.todoList.methods.toggleComplete(taskId).send({from : this.state.account}).once('reciept', (receipt) => {
          this.setState({loading : false})
        })
        let task = await this.state.todoList.methods.Tasks(taskId).call();
        console.log(task)
    }
    
    render() {
        let el;
        if(this.state.loading){
            el = (
            <ul id="taskList" className="list-unstyled">
              { this.state.tasks.filter(task => task.complete === false).map((task, key) => {
                return(
                  <div className="taskTemplate" className="checkbox" key={key}>
                    <label>
                      <input type="checkbox"
                        name = {task.id}
                        defaultChecked = {task.completed}
                        ref = {(input) => {
                          this.checkbox = input
                        }}
                        onClick = {(e) => {
                          this.toggleCompleted(this.checkbox.name)
                        }}
                      />
                      <span className="content">{task.content}</span>
                    </label>
                  </div>
                )
              })}
            </ul>
           )
        }
        else{
            el = (<div id="loader" className="text-center">
                <p className="text-center">Loading...</p>
          </div>)
        }
        return (
  <div>
    <br />
    <br />
    <div className="container-fluid">
      <div className="row">
        <main role="main" className="col-lg-12 d-flex justify-content-center">
          <div id="content">
            <form onSubmit = {(e) => {
                e.preventDefault()
                this.createTask()
                this.setState({content : ''})
            }}>
              <input id="newTask" 
              type="text" 
              className="form-control" 
              placeholder="Add task..." 
              value = {this.state.content}
              onChange = {e => this.setState({content : e.target.value})}
              required />
              <input type="submit" hidden="" />
            </form>
            {el}
            <br />
            <br />
            <h2>Completed Tasks</h2>
            <ul id="completedTaskList" className="list-unstyled">
            {
            this.state.tasks.filter(task => task.complete === true).map(task => {
              return(
                <li key = {task.id}>{task.content}</li>
              );
            })
            }
            </ul>
            <br />
            <br />
            <button onClick = {this.refreshPage}>Refresh This</button>
          </div>
        </main>
      </div>
    </div>
  </div>
);
}
}


















































// import React, { useEffect, useState } from 'react'
// import Web3 from 'web3';
// import './App.css';
// import TodoList from './abi/TodoList.json'


// const App = () => {
//     const [account, setAccount] = useState('');
//     const [Todo, settodoList] = useState({});
//     const [TaskCount, setTaskCount] = useState(0);
//     const [Task, setTask] = useState([1]);

//     const loadWeb3 = async() => {
//         if(window.ethereum){
//             window.web3 = new Web3(window.ethereum)
//             await window.ethereum.enable();
//         }
//         else if(window.web3) window.web3 = new Web3(window.currentProvider);
//         else window.alert('Non-Etherium browser detected. You Should consider using MetaMask !')
//     }

//     const loadBlockchainData = async() =>{
//             const web3 = window.web3;
//             const accounts = await web3.eth.getAccounts()
//             setAccount(accounts[0])

//             const networkId = await web3.eth.net.getId();
//             const networkData = TodoList.networks[networkId];
            
//             if(networkData){
//                 const todoList = new web3.eth.Contract(TodoList.abi, networkData.address);
//                 settodoList(todoList)
//                 console.log(Todo)
//             }
//     }

//     useEffect(() => {
//         loadWeb3();
//     }, [])

//     useEffect(() => {
//         loadBlockchainData();
//     }, [])

//     return (
//         <>
//             <div className="container">
//                 <h4>Account: {account}</h4>
//             </div>
//         </>
//     )
// }

// export default App
