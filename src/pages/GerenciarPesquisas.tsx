import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function GerenciarPesquisas() {
  const navigate = useNavigate();
  const [pesquisas, setPesquisas] = useState<any[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("pesquisas");
    if (saved) setPesquisas(JSON.parse(saved));
  }, []);

  const handleExcluir = (id: number) => {
    if (window.confirm("Deseja realmente excluir esta pesquisa?")) {
      const novas = pesquisas.filter(p => p.id !== id);
      setPesquisas(novas);
      localStorage.setItem("pesquisas", JSON.stringify(novas));
      toast.warn("Pesquisa removida.");
    }
  };

  const salvarEdicao = (id: number, novoNome: string, novaDesc: string) => {
    const novas = pesquisas.map(p => 
      p.id === id ? { ...p, nome: novoNome, descricao: novaDesc } : p
    );
    setPesquisas(novas);
    localStorage.setItem("pesquisas", JSON.stringify(novas));
    setEditandoId(null);
    toast.success("Alterações salvas!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10 max-w-4xl mx-auto">
      
      <button onClick={() => navigate(-1)} className="text-green-700 font-bold mb-4">
        ← Voltar
      </button>

      <h1 className="text-3xl font-black text-green-700 mb-8">
        Gerenciar Pesquisas
      </h1>

      {pesquisas.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-gray-500 mb-4">
            Você não possui nenhuma pesquisa cadastrada
          </p>
          <button 
            onClick={() => navigate("/cadastrar-pesquisa")}
            className="bg-green-700 text-white px-6 py-3 rounded-lg font-bold"
          >
            Cadastrar pesquisa
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {pesquisas.map(p => (
            <div key={p.id} className="bg-white p-5 rounded-xl shadow relative">

              <div className="absolute top-3 right-3 flex gap-2">
                <button onClick={() => setEditandoId(p.id)}>✏️</button>
                <button onClick={() => handleExcluir(p.id)}>🗑️</button>
              </div>

              {editandoId === p.id ? (
                <>
                  <input 
                    id={`n-${p.id}`}
                    defaultValue={p.nome}
                    className="border p-2 w-full mb-2"
                  />
                  <textarea 
                    id={`d-${p.id}`}
                    defaultValue={p.descricao}
                    className="border p-2 w-full mb-2"
                  />
                  <button
                    onClick={() => {
                      const n = (document.getElementById(`n-${p.id}`) as HTMLInputElement).value;
                      const d = (document.getElementById(`d-${p.id}`) as HTMLTextAreaElement).value;
                      salvarEdicao(p.id, n, d);
                    }}
                    className="bg-green-700 text-white px-3 py-1 rounded"
                  >
                    Salvar
                  </button>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-lg">
                    {p.nome || "Sem título"}
                  </h3>

                  {/* ✅ LIMITE DE 3 LINHAS */}
                  <p
                    className="text-gray-600"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}
                    title={p.descricao}
                  >
                    {p.descricao || "Sem descrição"}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}