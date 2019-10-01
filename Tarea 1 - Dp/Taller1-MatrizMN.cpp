#include <bits/stdc++.h>

using namespace std;

int M = 0;
int N = 0;
int minimo = INT_MAX;
vector<vector<int>> Matriz;
vector<vector<bool>> visitado;
vector<vector<int>> dp;

void llenar_Aleatorio(){
    int Aleatorio = 0;
    srand(time(NULL));
    for (int i = 0; i < M; i++){
        vector<int> aux;
        vector<int> aux_dp;
        vector<bool> aux_v;
        for (int j = 0; j < N; j++){
            Aleatorio = 1 + rand() % (10001-1);
            aux.push_back(Aleatorio);
            aux_v.push_back(false);
            aux_dp.push_back(100000000);
        }
        Matriz.push_back(aux);
        visitado.push_back(aux_v);
        dp.push_back(aux_dp);
    }
}

int camino_Minimo(int i, int j, int sum){
    if((i+1) == M && (j+1) == N){
        if(sum<minimo) minimo = sum;
        cout<<"El nuevo minimo es: "<<minimo<<endl;
        return Matriz[i][j];
    }
    else if(i>=M || i<0 || j>=N || j < 0 || visitado[i][j] || sum>minimo || sum>dp[i][j]){
        // cout<<"fuera "<<i<<" - "<<j<<endl;
        // cout<<dp[i][j]<<endl;
        // cout<<sum<<endl;
        // cout<<visitado[i][j]<<endl;
        return 1000000;
    }
    else{
        int arriba,abajo,izquierda,derecha;
        if(i+1<M)  abajo =  abs (Matriz[i][j] - Matriz[i+1][j]);
        else  abajo = 1000000;
        if(i-1>=0)  arriba =  abs (Matriz[i][j] - Matriz[i-1][j]);
        else  arriba = 1000000;
        if(j+1<N)  derecha =  abs (Matriz[i][j] - Matriz[i][j+1]);
        else  derecha = 1000000;
        if(j-1>=0)  izquierda =  abs (Matriz[i][j] - Matriz[i][j-1]);
        else  izquierda = 1000000;
        if(i + 1 < M){
            // cout <<i<<" - "<<j<<" abajo "<<endl;
            visitado[i][j] = true;
            sum = sum + abajo;
            if(dp[i+1][j]>sum && sum<minimo){
                dp[i+1][j] = sum;
                // cout<<"update i+1"<<endl;
                // cout<<dp[i+1][j]<<endl;
                // cout<<sum<<endl;
                camino_Minimo(i+1,j,sum);
            }
            sum = sum - abajo;
            visitado[i][j] = false;
        }
        if(j +1 < N){
            // cout <<i<<" - "<<j<<" derecha "<<endl;
            visitado[i][j] = true;
            sum = sum + derecha;
            if(dp[i][j+1]>sum && sum<minimo){
                dp[i][j+1] = sum;
                // cout<<"update j+1"<<endl;
                // cout<<dp[i][j+1]<<endl;
                // cout<<sum<<endl;
                camino_Minimo(i,j+1,sum);
            }
            sum = sum - derecha;
            visitado[i][j] = false;
        }
        if(j - 1 >= 0 ){
            // cout <<i<<" - "<<j<<" izquierda "<<endl;
            visitado[i][j] = true;
            sum = sum + izquierda;
            if(dp[i][j-1]>sum && sum<minimo){
                dp[i][j-1] = sum;
                // cout<<"update j-1"<<endl;
                // cout<<dp[i][j-1]<<endl;
                // cout<<sum<<endl;
                camino_Minimo(i,j-1,sum);
            }
            sum = sum - izquierda;
            visitado[i][j] = false;
        }
        if(i - 1 >= 0){
            // cout <<i<<" - "<<j<<" arriba "<<endl;
            visitado[i][j] = true;
            sum = sum + arriba;
            if(dp[i-1][j]>sum && sum<minimo){
                dp[i-1][j] = sum;
                // cout<<"update i-1"<<endl;
                // cout<<dp[i-1][j]<<endl;
                // cout<<sum<<endl;
                camino_Minimo(i-1,j,sum);
            }
            sum = sum - arriba;
            visitado[i][j] = false;
        }
        return 5000;
    }
}

int main (){
    auto start = chrono::steady_clock::now();
    cout <<"Ingrese la cantidad de filas de la matriz"<<endl;
    cin>>M;
    cout <<"Ingrese la cantidad de columnas de la matriz"<<endl;
    cin>>N;
    cout<<endl;
    llenar_Aleatorio();
    for (int i = 0; i < M; i++){
        for (int j = 0; j < N; j++){
            cout << Matriz[i][j] << " ";
        }
        cout<<endl;
    }
    cout<<endl;
    camino_Minimo(0,0,0);
    cout<<"El minimo es: "<<minimo<<endl;
    // cout<<"El minimo es: "<<dp[M-1][N-1]<<endl;
    auto end = chrono::steady_clock::now();
    cout << "\n\t\tTime taken  = " << chrono::duration_cast<chrono::nanoseconds>(end-start).count() << " [ns]" ;
}