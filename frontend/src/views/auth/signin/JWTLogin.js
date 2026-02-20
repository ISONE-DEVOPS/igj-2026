import React, {useState,useEffect} from 'react';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';
import useAuth from '../../../hooks/useAuth';
import useScriptRef from '../../../hooks/useScriptRef';

import api from '../../../services/api';

const JWTLogin = ({ className, ...rest }) => {
  const { login, resetlockdata } = useAuth();
  const scriptedRef = useScriptRef();

  const [seepassword,setseepassword] = useState(false);

  useEffect(()=> {
        
    resetlockdata()

  },[])

  return (
      <Formik
          initialValues={{
            email: '',
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

              const uploaditem = {"USERNAME": values.email, "PASSWORD":values.password}

              const response = await api.post('/sessions', uploaditem);
              

              if(response.data.status==='0'){ 
                setStatus({ success: true });
                setSubmitting(true);
                login(response.data)
              } else{

                if(response.data.status==='242'){
                  setErrors({ submit: "Credenciais incorretas"});
                }

                if(response.data.status==='250'){
                  setErrors({ submit: "Conta desativada"});
                }
                
                setSubmitting(false);
                setStatus({ success: false });
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
              <div className="form-group mb-3">
                <span className="form-control" style={{display:"flex",borderColor:"#DABF4A",alignItems:"center"}}>
                  <i className="feather icon-user" style={{marginRight:"8px"}}/> 
                  <input
                    style={{border:"0",width:"100%"}}
                    error={touched.email && errors.email}
                    label="Utilizador"
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="text"
                    value={values.email}
                    placeholder='Utilizador'
                  />

                </span>
                
              {touched.email && errors.email && (                 
                <small class="text-danger form-text">{errors.email}</small>
              )}
            </div>
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
                  Entrar
                </Button>
              </Col>
            </Row>
          </form>
        )}
      </Formik>
  );
};

export default JWTLogin;