import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Pesquisa {
  id: number;
  autor: string;
  nome: string;
  descricao: string;
  data: string;
}

export default function MinhasPesquisas() {
  const navigate = useNavigate();
  const [pesquisas, setPesquisas] = useState<Pesquisa[]>([]);

  useEffect(() => {
    const userStorage = JSON.parse(localStorage.getItem("usuarioLogado") || "null");
    
    if (!userStorage) {
      navigate("/login", {
  state: {
    from: location,
    precisaLogin: true
  }
})
      return;
    }

    const todasPesquisas = JSON.parse(localStorage.getItem("pesquisas") || "[]");
    
    const filtradas = todasPesquisas.filter(
      (p: Pesquisa) => p.autor === (userStorage.nome || userStorage.email)
    );

    setPesquisas(filtradas);
  }, [navigate]);

  return (
    <div className="min-h-[85vh] bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-green-700">Minhas Pesquisas</h2>
          <button 
            onClick={() => navigate("/perfil")}
            className="text-sm text-gray-500 hover:text-green-700"
          >
            ← Voltar ao Perfil
          </button>
        </div>

        {pesquisas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pesquisas.map((p) => (
              <button
                key={p.id}
                onClick={() => navigate(`/dashboard/${p.id}`)}
                className="bg-white p-5 rounded-xl shadow border-l-4 border-green-600 text-left"
              >
                <div className="flex justify-between mb-2">
                  <h3 className="font-bold text-gray-800">
                    {p.nome || "Pesquisa sem título"}
                  </h3>
                  <span className="text-xs text-gray-400">
                    {p.data}
                  </span>
                </div>
                
                {/* ✅ LIMITE DE 3 LINHAS */}
                <p 
                  className="text-sm text-gray-600 line-clamp-3"
                  title={p.descricao}
                >
                  {p.descricao}
                </p>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl">
            <p className="text-gray-500 mb-4">
              Você não possui nenhuma pesquisa cadastrada
            </p>
            <button
              onClick={() => navigate("/pesquisa")}
              className="bg-green-700 text-white px-6 py-2 rounded-lg"
            >
              Cadastrar sua pesquisa
            </button>
          </div>
        )}
      </div>
    </div>
  );
}