import { useState } from "react";

function App() {
  const [result, setResult] = useState(null);
  const [year, setYear] = useState(null);
  const [totalDays, setTotalDays] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRandom = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/random");
      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setResult(data.result);
      setYear(data.year);
      setTotalDays(data.totalDays);
    } catch {
      alert("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-[400px] text-center">
        <h1 className="text-2xl font-bold mb-6">Random Ngày Trong Năm</h1>

        <button
          onClick={handleRandom}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition duration-200 w-full"
        >
          {loading ? "Đang quay..." : "Quay số"}
        </button>

        {result && (
          <div className="mt-8">
            <p className="text-gray-600">Năm: {year}</p>
            <p className="text-gray-600">Tổng số ngày: {totalDays}</p>
            <p className="text-4xl font-bold text-purple-600 mt-4">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
