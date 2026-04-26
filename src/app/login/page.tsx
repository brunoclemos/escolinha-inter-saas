import Image from "next/image";
import { loginWithGoogle } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const errorMsg =
    params.error === "AccessDenied"
      ? "Esta conta Google não tem acesso ao sistema. Fale com a coordenação da escolinha."
      : params.error
      ? "Não conseguimos completar o login. Tenta de novo em alguns segundos."
      : null;

  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      {/* Lado esquerdo: identidade visual */}
      <aside className="relative hidden lg:flex bg-inter-red text-white p-12 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4), transparent 40%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.3), transparent 35%)",
          }}
        />
        <div className="relative flex items-center gap-3">
          <div className="h-14 w-14 bg-white/10 backdrop-blur rounded-xl p-1.5 border border-white/15">
            <Image
              src="/logo-escola.png"
              alt="Escola do Inter"
              width={56}
              height={56}
              className="object-contain w-full h-full"
            />
          </div>
          <div>
            <div className="font-semibold text-lg">Escola do Inter</div>
            <div className="text-xs text-white/70 mono">Rio Grande · RS</div>
          </div>
        </div>

        <div className="relative max-w-md">
          <div className="text-[11px] uppercase tracking-widest text-white/60 font-semibold mb-3">
            Sistema de Análise de Atletas
          </div>
          <h1 className="text-3xl font-semibold leading-tight">
            Acompanhe a evolução técnica, física e comportamental do seu filho
            com o mesmo rigor que clubes profissionais usam.
          </h1>
          <p className="mt-5 text-sm text-white/75 leading-relaxed">
            Escolinha credenciada Sport Club Internacional. Avaliações
            trimestrais, relatórios em PDF e dossiê para o Inter quando o atleta
            estiver pronto para uma avaliação técnica das categorias de base.
          </p>
        </div>

        <div className="relative text-[11px] text-white/55 mono">
          v0.1 · prototipo · LGPD-compliant
        </div>
      </aside>

      {/* Lado direito: formulário */}
      <section className="flex items-center justify-center p-8 lg:p-12 bg-inter-bg">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="h-12 w-12 bg-inter-red rounded-xl p-1.5">
              <Image
                src="/logo-escola.png"
                alt="Escola do Inter"
                width={48}
                height={48}
                className="object-contain w-full h-full"
              />
            </div>
            <div>
              <div className="font-semibold">Escola do Inter</div>
              <div className="text-xs text-inter-mute mono">Rio Grande · RS</div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-inter-black">
            Entrar na plataforma
          </h2>
          <p className="mt-2 text-sm text-inter-mute leading-relaxed">
            Acesso restrito a coordenação, professores e responsáveis cadastrados.
            Faça login com a conta Google associada à matrícula.
          </p>

          {errorMsg && (
            <div className="mt-6 p-3 rounded-md bg-inter-red-soft border border-inter-red/20 text-xs text-inter-red-dark">
              {errorMsg}
            </div>
          )}

          <form action={loginWithGoogle} className="mt-8">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-3 h-12 px-4 rounded-md
                         bg-white border border-inter-line text-sm font-medium text-inter-graphite
                         hover:bg-inter-bg active:bg-inter-line/40 transition-colors"
            >
              <GoogleLogo />
              Entrar com Google
            </button>
          </form>

          <div className="mt-8 text-[11px] text-inter-subtle leading-relaxed">
            Ao entrar, você concorda em usar a plataforma exclusivamente para
            acompanhar dados do(a) atleta sob sua responsabilidade. Os dados
            seguem o tratamento descrito na Política de Privacidade da escolinha.
          </div>
        </div>
      </section>
    </main>
  );
}

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.08-1.79 2.72v2.26h2.9c1.7-1.56 2.69-3.87 2.69-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.46-.81 5.95-2.18l-2.9-2.26c-.8.54-1.83.86-3.05.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.71A5.41 5.41 0 0 1 3.68 9c0-.59.1-1.17.29-1.71V4.96H.96A8.997 8.997 0 0 0 0 9c0 1.45.35 2.82.96 4.04l3.01-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96L3.97 7.3C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}
