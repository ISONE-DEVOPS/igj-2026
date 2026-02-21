import React, { useState, useEffect } from 'react';
import api from '../../../../../../services/api'; 
import Friend from "./Friend";


import useAuth from '../../../../../../hooks/useAuth';
import { taskEnable } from '../../../../../../functions';



const Friends = ({ listOpen, search }) => { 


    const { useronline, permissoes } = useAuth();


    const [friend,setfriend] = useState([]);
    const [newdata,setnewdata] = useState([]);

 
    const friendList = (friend).map(f => {
        return <Friend key={f.id} data={f}  />;
    });


    useEffect(()=> {

        
        uploadlist()


    
      },[])


      useEffect(()=> {

        
        uploadlist()



    
      },[useronline])


      useEffect(()=> {

        
        makefilter()
    
      },[search])




      function filter(x,firstTimte){

        let data = x

        if(search==""||search==null||search==" "){

            if(firstTimte) return x
            else return newdata

        }
        
        
        else {

            for (let i = 0; i < data.length; i++) {

    
                
    
                let text = data[i].sgigjrelpessoaentidade.sgigjpessoa.NOME
                let txt=new RegExp(search,"i");

                if(text.match(txt)==null){

                    data[i].remove=true

                }else {

                    data[i].remove=false

                }
    
    
    
            }

            let filtered = data.filter(function (el) {
                return el.remove != true;
                });
    
            
    
            return filtered

        } 
        
        

      }


      function makefilter(){

        setfriend(filter(newdata,false))

    }


    async function uploadlist(){

        try {

            if(taskEnable("/administracao/utilizador",permissoes,"useronline")) {

                
                const response = await api.get('/glbuseronline');           

                if(response.status=='200'){ 
                            
                    for (var i = 0; i < response.data.length; i++) {

                    
                        response.data[i].id=response.data[i].ID
                        response.data[i].photo=response.data[i].URL_FOTO+"?alt=media&token=0"
                        response.data[i].name=response.data[i].sgigjrelpessoaentidade.sgigjpessoa.NOME
                        response.data[i].status=1
                        response.data[i].time='online'
                        
                    
                    }


                    setnewdata(response.data)
                    setfriend(filter(response.data,true))


            }
        
            }

          } catch (err) {

            console.error(err.response)       
            
          }

    }



    return (
        <React.Fragment>
            {friendList}
            
        </React.Fragment>
    );
};

export default Friends;
