import { Alert } from "react-native";
import { api } from "./api";


async function status() {
    try {
        const { data } = await api.get(`/status`)

        return data
    } catch (error) {
        throw error
    }
}

async function checkForUpdates() {
    try {
        const { data } = await api.get(`/development-version-list`)

        return data
    } catch (error) {
        throw error
    }
}

async function updateDevDevice(id) {
    try {
        const { data } = await api.get(`/development-version/${id}`)
        return data
    } catch (error) {
        throw error
    }
}

async function updateTraceDevice(data) {
    try {
        // console.log(data)
        const resposta = await api.post(`/trace/data`, data)
        return resposta
    } catch (error) {
        // Verifique se é um erro de resposta da API
        if (error.response) {

            // console.log('Response error:', error.response.data.message);
            // console.log('Status:', error.response.status);

            if (error.response.status == 400) {
             Alert.alert("Error", "Peça ja cadastrada no servidor.");

            }
        } 
    }
}

export const serverRoutes = {
    status,
    checkForUpdates,
    updateDevDevice,
    updateTraceDevice
}   