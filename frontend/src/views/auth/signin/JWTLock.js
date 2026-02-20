import React, {useState,useEffect} from 'react';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';
import useAuth from '../../../hooks/useAuth';
import useScriptRef from '../../../hooks/useScriptRef';

import { useHistory } from 'react-router-dom';


import api from '../../../services/api';

const JWTLock = ({ className, ...rest }) => {

  const history = useHistory();

  const { login, lockdata, resetlockdata } = useAuth();

  const scriptedRef = useScriptRef();

  const [seepassword,setseepassword] = useState(false);


  useEffect(()=> {

    if(lockdata.ative==false) history.push('/')
        

  },[])


  return (
      <Formik
          initialValues={{
            email: lockdata.username,
            password: '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            
            email: Yup.string().max(64).required('O Utilizador é obrigatório'),
            password: Yup.string().max(65).required('A palavra-passe é obrigatório')
          })}
          onSubmit={async (values, {
            setErrors,
            setStatus,
            setSubmitting
          }) => {
            try {

              delete api.defaults.headers.common.Authorization;

              const uploaditem = {"USERNAME": lockdata.username, "PASSWORD":values.password}

              const response = await api.post('/sessions', uploaditem);
              

              if(response.data.status==='0'){ 

                setStatus({ success: true });
                setSubmitting(true);
                login(response.data)

                const data = lockdata.link.substring(5,lockdata.link.length)

                resetlockdata()
            
                history.push(data)


              }

              if(response.data.status==='242'){
                setStatus({ success: false });
                setErrors({ submit: "Credenciais incorretas"});
                setSubmitting(false);
              }


            } catch (err) {
              
              if (scriptedRef.current) {
                setStatus({ success: false });
                setErrors({ submit: "Tente novamente mais tarde" });
                setSubmitting(false);
              }
            }
          }
        
        }
      >
        
        {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values
          }) => (
            <form
                noValidate
                onSubmit={handleSubmit}
                className={className}
                {...rest}
            >
             
            <div className="form-group mb-4">
              <span className="form-control" style={{display:"flex",borderColor:"#DABF4A",alignItems:"center"}}>
                <i className="feather icon-lock" style={{marginRight:"8px"}}/> 
                <input
                  style={{border:"0",width:"100%"}}
                  error={touched.password && errors.password}
                  label="Palavra-passe"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type={seepassword?"text":"password"}
                  value={values.password}
                  placeholder='Palavra-passe'
                />
                <i className={seepassword?"feather icon-eye":"feather icon-eye-off"} style={{cursor:"pointer"}} onClick={()=>setseepassword(!seepassword)}/> 
              </span>
              
              {touched.password && errors.password && (                 
                <small style={{color:"red"}} class="text-danger form-text">{errors.password}</small>
              )}
            </div>

            
            {errors.submit && ( 
              <Col sm={12}>
                  <Alert>{errors.submit}</Alert>
              </Col>
            )}


            <Row>
              <Col mt={2}>
                <Button
                  className="btn-block mb-4"
                  color="primary"
                  disabled={isSubmitting}
                  size="large"
                  type="submit"
                  variant="primary"
                >
                  Desbloquear
                </Button>
              </Col>
            </Row>
          </form>
        )}
      </Formik>
  );
};

export default JWTLock;