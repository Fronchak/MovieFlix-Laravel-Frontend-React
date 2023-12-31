import { useEffect, useRef, useCallback } from 'react';
import useFetchFunction from "../../hooks/useFetchFunction";
import PageType from "../../types/PageType";
import SimpleUserType from "../../types/models/SimpleUserType";
import { BASE_API_URL } from '../../utils/Contantes';
import useAuth from '../../hooks/useAuth';
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserImage from '../../assets/imgs/user.png';
import UsersTableLoader from '../../components/UsersTableLoader';
import Pagination from '../../components/Pagination';
import PaginationLoader from '../../components/PaginationLoader';

const Users = () => {

  const { data, error, status, fetchFunction } = useFetchFunction<PageType<SimpleUserType>>();
  const { token, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const refEffect = useRef<boolean>(false);

  const fetchUsers = useCallback((page: number = 0) => {
    if(!isAuthenticated()) {
      logout();
      navigate("/auth/login", {
        replace: true,
        state: {
          from: pathname
        }
      });
      toast.info("Você precisa estar logado para acessar esse conteúdo");
      return;
    }
    fetchFunction(`${BASE_API_URL}/api/users?size=4&page=${page}`, {
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
  }, [isAuthenticated, navigate, fetchFunction, token])

  useEffect(() => {
    if(refEffect.current === false) {
        fetchUsers();
      return () => {
        refEffect.current = true;
      }
    }
  }, []);

  useEffect(() => {
    if(error && status) {
      if(status === 401) {
        logout();
        navigate("/auth/login", {
          replace: true,
          state: {
            from: pathname
          }
        });
        toast.info("Você precisa estar logado para acessar esse conteúdo");
      }
      else if(status === 403) {
        navigate("/movies");
        toast.info("Você não tem permissão para acessar esse conteúdo");
      }
    }
    else if(error && !status) {
      navigate("/");
      toast.error("Erro ao carregar usuários, favor tentar novamente mais tarde");
    }

  });

  const handlePageChange = (page: number) => {
    fetchUsers(page + 1);
  }

  return (
    <div>
      <header className='mb-3'>
        <h2 className='text-2xl font-bold uppercase text-white'>Users</h2>
      </header>

      { !data && (
        <>
          <UsersTableLoader />
          <PaginationLoader />
        </>
      ) }
        { data && (
          <>
            <div className="flex flex-col">
              <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                  <div className="overflow-hidden">
                    <table className="min-w-full text-md text-left font-light">
                      <thead
                        className="border-b font-bold bg-white">
                        <tr>
                          <th scope="col" className=" px-6 py-4"></th>
                          <th scope="col" className="pl-2 pr-6 py-4">Email</th>
                          <th scope="col" className=" px-6 py-4">Usuário</th>
                          <th scope="col" className=" px-6 py-4"></th>
                        </tr>
                      </thead>
                      <tbody className='text-white'>
                        { data.data.map((user) => (
                          <tr className='border-b transition duration-300 ease-in-out hover:bg-neutral-500' key={user.id}>
                            <td className="whitespace-nowrap px-1 py-1">
                              <img src={ user.image ? `${BASE_API_URL}/storage/${user.image}` : UserImage } className='w-12 h-12 rounded-full' />
                            </td>
                            <td className="whitespace-nowrap pl-2  pr-6 py-1">{ user.email }</td>
                            <td className="whitespace-nowrap  px-6 py-1">{ user.name }</td>
                            <td className="whitespace-nowrap  px-6 py-1">
                              <Link to={`/users/edit/${user.id}`} className='btn px-2 py-1 bg-blue-500 hover:bg-blue-700 text-sm'>Editar</Link>
                            </td>
                          </tr>
                        )) }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <Pagination
              activePage={data.current_page - 1}
              pageCount={data.last_page}
              onPageChange={handlePageChange}
            />
          </>


        ) }

    </div>
  )
}

export default Users;
