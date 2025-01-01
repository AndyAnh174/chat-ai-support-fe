import { Icon, IconBrandGithub } from '../components/Icons'

interface TeamMember {
  name: string
  role: string
  image: string
  bio: string
  github?: string
}

const teamMembers: TeamMember[] = [
  {
    name: "Hồ Việt Anh",
    role: "Full Stack Developer",
    image: "https://scontent.fsgn8-1.fna.fbcdn.net/v/t39.30808-6/469901955_1785558632295446_1929469004812847546_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeGZTAvTABZWDHa8xV-abRzAzxOHfLk_ZwTPE4d8uT9nBIcB8eaWLR5AqdT8ay-LebomuAPYTwUtuki1TirUHEcm&_nc_ohc=D0R09KOQ8c8Q7kNvgF9H8B_&_nc_oc=AdhpfAxc2nHGnePNxvraEqxIaaFZUs1Y2WT3SX8NlQMxlazaGaA_6pXai3SMIxtBOeA&_nc_zt=23&_nc_ht=scontent.fsgn8-1.fna&_nc_gid=AMR3r07kk8kngObiJlETuW5&oh=00_AYDvxp_rYTW2YolD2G4VF3M1iRvvNQ7xYWoFnWwJtKUYfg&oe=677A4099",
    bio: "Sinh viên cận năm 3 ngành Data Engineering, đam mê về linux và phát triển web.",
    github: "https://github.com/andyanh174"
  },
  {
    name: "Trần Văn B",
    role: "Developer",
    image: "/team/member2.jpg",
    bio: "Sinh viên năm cuối ngành CNTT, chuyên về Frontend Development.",
    github: "https://github.com/friend-username"
  }
]

const About = () => {
  return (
    <div className="min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <div className="hero bg-base-200 py-16">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-8">Về Dự Án</h1>
            <p className="text-lg mb-6">
              AI Chat Support là một dự án cá nhân được phát triển nhằm mục đích học tập 
              và nghiên cứu về AI. Dự án sử dụng công nghệ Google Gemini để tạo ra 
              trải nghiệm chat thông minh và hữu ích.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-base-100">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Thành Viên</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="card bg-base-200 hover:shadow-xl transition-shadow">
                <figure className="px-10 pt-10">
                  <div className="avatar">
                    <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img src={member.image} alt={member.name} />
                    </div>
                  </div>
                </figure>
                <div className="card-body items-center text-center">
                  <h3 className="card-title">{member.name}</h3>
                  <div className="badge badge-primary">{member.role}</div>
                  <p>{member.bio}</p>
                  {member.github && (
                    <a 
                      href={member.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-ghost gap-2"
                    >
                      <Icon icon={IconBrandGithub} size={20} />
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="py-16 bg-base-200">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Công nghệ sử dụng</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="badge badge-lg p-4">React</div>
            <div className="badge badge-lg p-4">TypeScript</div>
            <div className="badge badge-lg p-4">Google Gemini</div>
            <div className="badge badge-lg p-4">DaisyUI</div>
            <div className="badge badge-lg p-4">Tailwind CSS</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About 