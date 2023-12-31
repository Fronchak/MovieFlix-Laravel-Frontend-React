import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { BASE_API_URL } from '../../utils/Contantes';
import GenreType from '../../types/models/GenreType';
import GenreCard from '../../components/GenreCard';
import useFetchFunction from '../../hooks/useFetchFunction';
import useAuth from '../../hooks/useAuth';
import { toast } from "react-toastify";
import AdminCardLoader from '../../components/AdminCardLoader';

const Genres = () => {

  const { data, isLoading, error, status } = useFetch<Array<GenreType>>(`${BASE_API_URL}/api/genres`, {
    headers: {
      "Accept": "application/json"
    }
  });
  const { isAuthenticated, hasAnyRole, logout, token } = useAuth();
  const [genres, setGenres] = useState<Array<GenreType> | undefined>();
  const [idDeleted, setIdDeleted] = useState<number | undefined>();
  const useFetchFunctionObj = useFetchFunction();
  const navigate = useNavigate();

  useEffect(() => {
    if(data !== undefined) {
      setGenres(data);
    }
    else {
      setGenres(undefined);
    }
  }, [data]);

  const handleDelete = (id: number) => {
    if(!isAuthenticated()) {
      navigate("/auth/login");
      logout();
      toast.info("Você precisa estar logado para realizar essa ação");
      return;
    }
    if(!hasAnyRole(['admin'])) {
      toast.info("Você não tem permissão para realizar essa ação");
      return;
    }
    setIdDeleted(id);
    useFetchFunctionObj.fetchFunction(`${BASE_API_URL}/api/genres/${id}`, {
      method: 'DELETE',
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
  }

  useEffect(() => {
    if(error) {
      navigate('/');
      toast.error('Erro ao carregar gêneros, favor tentar novamente mais tarde');
    }
  }, [error]);

  useEffect(() => {
    if(useFetchFunctionObj.status === 204) {
      toast.success("Gênero deletado com sucesso");
      const nextGenres = genres?.filter((genre) => genre.id != idDeleted);
      setGenres(nextGenres);
    }
  }, [useFetchFunctionObj.status, idDeleted])

  return (
    <div >
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-white font-bold text-2xl uppercase">Gêneros</h2>
        <Link className="btn px-4 py-1 bg-blue-500 hover:bg-blue-700" to="/genres/save">Adicionar gênero</Link>
      </div>
      { isLoading && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            <AdminCardLoader />
            <AdminCardLoader />
            <AdminCardLoader />
            <AdminCardLoader />
          </div>
      ) }
      { genres && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          { genres.map((genre) => (
            <div className="p-0" key={genre.id}>
              <GenreCard genre={genre} handleDelete={handleDelete} />
            </div>
          )) }
        </div>
      ) }
    </div>
  )
}

export default Genres;
