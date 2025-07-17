export default {
    async contactCoach(context, payload) {
        const newRequest = {
            userEmail: payload.email,
            message: payload.message,
        };

        const response = await fetch(`https://vue-http-demo-7621b-default-rtdb.firebaseio.com/requests/${payload.coachId}.json`, {
            method: 'POST',
            body: JSON.stringify(newRequest), // 將object資訊轉換成json格式
        })

        const responseData = await response.json();

        if (!response.ok) {
            const error = new Error(responseData.message || 'Failed to send request.');
            throw error;
        }

        // 只記載在local data，不記載在Firebase上
        newRequest.id = responseData.name;
        newRequest.coachId = payload.coachId,

        context.commit('addrequest', newRequest);
    },
    async fetchRequests(context) {
        const coachId = context.rootGetters.userId;
        const token = context.rootGetters.token;
        const response = await fetch(`https://vue-http-demo-7621b-default-rtdb.firebaseio.com/requests/${coachId}.json?auth=${token}`);
        const responseData = await response.json();
        if (!response.ok) {
            const error = new Error(responseData.message || 'Fail to fetch requests.');
            throw error;
        }
        const requests = [];
        for (const key in responseData) {
            const request = {
                id: key,
                coachId: coachId,
                userEmail: responseData[key].userEmail,
                message: responseData[key].message,
            };
            requests.push(request);
        }
        context.commit('setRequests', requests);
    }
}