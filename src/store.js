import Vue from 'vue'
import Vuex from 'vuex'
import { getWeb3, pollWeb3 } from './utils/getWeb3'
import { getContract } from './utils/getContract'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        web3: {
            web3Instance: null,
            networkID: null,
            coinbase: null,
            balance: null
        },
        contractInstance: null
    },
    getters: {
        web3: state => state.web3,
        contractInstance: state => state.contractInstance
    },
    mutations: {
        setWeb3Meta (state, payload) {
            let web3Copy = state.web3
            web3Copy.web3Instance = payload.web3
            web3Copy.networkID = payload.networkID
            web3Copy.coinbase = payload.coinbase
            web3Copy.balance = parseInt(payload.balance, 10)
            state.web3 = web3Copy
            pollWeb3(state)
        },
        pollWeb3Instance (state, payload) {
            state.web3.coinbase = payload.coinbase
            state.web3.balance = parseInt(payload.balance, 10)
        },
        setContractInstance (state, payload) {
            state.contractInstance = () => payload
            console.log('setContractInstance')
        },
        resetWeb3Instance (state) {
            state.web3.web3Instance = null
            state.web3.networkID = null
            state.web3.coinbase = null
            state.web3.balance = null
        }
    },
    actions: {
        async checkWeb3({ commit, state }) {
            try {
                let result = await getWeb3
                commit('setWeb3Meta', result)
            } catch (err) {
                pollWeb3(state)
            }
        },
        async getContractInstance({ commit }) {
            try {
                let result = await getContract
                console.log(result)
                commit('setContractInstance', result)
            } catch (err) {
                throw new Error('Error in action getContractInstance')
            }
        }
    }
})
