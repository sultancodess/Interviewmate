import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import DashboardLayout from '../components/Layout/DashboardLayout'
import LoadingSpinner from '../components/LoadingSpinner'
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  DollarSign,
  Calendar,
  BarChart3,
  Settings,
  Shield,
  Database,
  Activity,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Brain,
  Zap,
  FileText,
  Download,
  RefreshCw,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Mail,
  Phone
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInterviews: 0,
    totalRevenue: 0,
    activeUsers: 0,
    freeUsers: 0,
    proUsers: 0,
    vapiMinutesUsed: 0,
    webSpeechMinutesUsed: 0
  })
  const [recentUsers, setRecentUsers] = useState([])
  const [recentInterviews, setRecentInterviews] = useState([])
  const [systemHealth, setSystemHealth] = useState({
    database: 'healthy',
    geminiAI: 'healthy',
    vapiService: 'warning',
    paymentGateway: 'healthy'
  })

  useEffect(() => {
    // Check if user is admin
    if (!user?.isAdmin) {
      toast.error('Access denied. Admin privileges required.')
      return
    }

    fetchAdminData()
  }, [user])

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      
      // Simulate API calls for admin data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setStats({
        totalUsers: 2847,
        totalInterviews: 8934,
        totalRevenue: 45230,
        activeUsers: 234,
        freeUsers: 2103,
        proUsers: 744,
        vapiMinutesUsed: 15420,
        webSpeechMinutesUsed: 89340
      })

      setRecentUsers([
        { id: 1, name: 'John Doe', email: 'john@example.com', plan: 'pro', joinedAt: '2024-01-15', status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', plan: 'free', joinedAt: '2024-01-14', status: 'active' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', plan: 'pro', joinedAt: '2024-01-13', status: 'inactive' },
        { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', plan: 'free', joinedAt: '2024-01-12', status: 'active' },
        { id: 5, name: 'David Brown', email: 'david@example.com', plan: 'pro', joinedAt: '2024-01-11', status: 'active' }
      ])

      setRecentInterviews([
        { id: 1, user: 'John Doe', type: 'technical', score: 85, duration: 25, createdAt: '2024-01-15T10:30:00Z' },
        { id: 2, user: 'Jane Smith', type: 'hr', score: 78, duration: 20, createdAt: '2024-01-15T09:15:00Z' },
        { id: 3, user: 'Mike Johnson', type: 'managerial', score: 92, duration: 30, createdAt: '2024-01-14T16:45:00Z' },
        { id: 4, user: 'Sarah Wilson', type: 'technical', score: 67, duration: 18, createdAt: '2024-01-14T14:20:00Z' },
        { id: 5, user: 'David Brown', type: 'hr', score: 89, duration: 22, createdAt: '2024-01-14T11:30:00Z' }
      ])

      setSystemHealth({
        database: 'healthy',
        geminiAI: 'healthy',
        vapiService: 'warning',
        paymentGateway: 'healthy'
      })

    } catch (error) {
      console.error('Failed to fetch admin data:', error)
      toast.error('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  const getHealthIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getHealthColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Sample data for charts
  const userGrowthData = [
    { month: 'Jan', users: 1200, interviews: 2400 },
    { month: 'Feb', users: 1450, interviews: 3100 },
    { month: 'Mar', users: 1680, interviews: 3800 },
    { month: 'Apr', users: 1920, interviews: 4500 },
    { month: 'May', users: 2150, interviews: 5200 },
    { month: 'Jun', users: 2380, interviews: 6100 },
    { month: 'Jul', users: 2620, interviews: 7200 },
    { month: 'Aug', users: 2847, interviews: 8934 }
  ]

  const planDistribution = [
    { name: 'Free', value: stats.freeUsers, color: '#3B82F6' },
    { name: 'Pro', value: stats.proUsers, color: '#10B981' }
  ]

  const interviewTypeData = [
    { type: 'HR', count: 3200, percentage: 36 },
    { type: 'Technical', count: 4100, percentage: 46 },
    { type: 'Managerial', count: 1634, percentage: 18 }
  ]

  if (!user?.isAdmin) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }
            <p className="text-gray-6ge.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className=">
          <LoadingSpin
        </div>

    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className>
          <div class
>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admi/h1>
              <p className="text-lg text-gray-600">m</p>
            </div>
            <div className="flex items-c">
              <button
                onClick={fetchAdminData}
                className="flex items-center px-4 py-2 bg-blue-600 text-w
              >
                <Refre mr-2" />
                Refresh
tton>
              <button className="flex items-center px-4 py-2 bg-green-60
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Navigation
        <div classNa
          <div cla0">

              {[
                { id: 'overview', name: 'Overview', icon: BarChart3
                { id: 'users', name: 'Use,
                { id: 'interviews', name: 'Interviews', icon: MessageSqure },
                { id: 'analytics', name: 'Analytics', icon: TrendingUp },
                { id: 'system', name: 'System Health', icon: Ac,
                { id: 'settings', name: 'Settings', icon: Setting
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() =
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab id
                      ? 'border-blue-5
                    ay-300'
}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid6">
              <div cl
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                    <User6" />
                  </div>
                  <div classNamml-4">
                    <p classNUsers</p>
                    <p className="text()}</p>
                    </p>
                  </div>
>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-cent">
                  <div className="p-2 roun
                    <MessageSquare className="w-
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Interviews</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalInterviews.toLocaleString()}</p>
                    <p className="text-xs text-green-600">+18% from last month</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-r">
                <div className="flex items-center">
                  <div classNam
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div className">
                    <p classN
                    <p className="text-2xl font-bold text-gray-900">
                    <p className="text-xs text-green-600">+25% from last mont/p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-ler">
                <div className="fter">
                  <div classN0">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div classN">
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold
                    <p classN>
                  </div>
                </div>
              </div>
            </div>

            {/* Ch
            <div-8">
          }
">
                <h3 class>
                <div className="h-8">
                  <ResponsiveContaine
                    <LineCh}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
                      <Lin} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Plan/}
              <div class">
                <h3 clh3>
                <div cl"h-80">
                  <ResponsiveContainer wid
                    <PieChart>
                      <Pie
                 ribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        f"
                    lue"
                  lue}`}
        >
                        {planDi (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </Pi
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div classNam
              {/* Recent Users */}
              <div className="bg-white rounded-lg shadow-sm bo
                <div className="p-6 border
                  <h3 className="text-lg h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-bet>
                        <div classNam">
                          <div claenter">
                            <span className="text-
                              {user.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <
                            <p className="text-xs text-gray-500">{us>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-ll ${
                            us
                          }`}>
                            {user
                          </span>
                          <span className={`w-2 h-2 rounded-full ${
                            user.status === 'active' ?
                          }`}span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Interviews 
              <div className="bg-whder">
                <div className=
                  <h3 className="text-lg font-semibold text-gray-900">Recent 3>
                </div>
                <div className="divide
                  {recentInterviews => (
                    <div keygray-50">
                      <div cl
                        <div>
                          <p className="text-sm font-mediu
                          <p className="text-xs text-gray-500 capitalize">{intervi/p>
                        </div>
                        <div classNam">
                          <p className={`text-sm font-medium ${
                            interview.score >= 80 ? 'text-' : 
                            interview'
                          }`}>
                            {interview.score}%
                          </p>
                          <p 500">
                            {new Date(interview.createdAt).tring()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

b */}
        {activeTab === 'system(
          <div className="space-y-6">
            <h2 className="text-2xl fth</h2>
            
            {/* System Status Cards */}
            <div className="grid grid-cols-1 md:grid">
              <div clas>
                <div className="flex items-centmb-4">
                  <div className="flex items-center space-x-3">
                    <Database className="w-6 h-6 text-blue-600" />
                 /h3>
                  </div>
                  {getHealthIcon(systemHealth.dabase)}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between t
                    <spanspan>
                    <spabase)}`}>
                      {systemHealth.database}
                    </span>
                  </div>
                 >
                    <span className="text-gray-600">Reime</span>
                    <span className="text-gray-900">45ms</span>
                  </div>
                </div>
              </div>

              <div cer">
                <d

                    <Brain className
                    <h3 className="font-medium text-gray-900">Gemini AI</h3>
                  </div>
                  {getHealthIcon(systemHea
                </div>
                <div cla">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getHealthColor(systemHealth.geI)}`}>
                      {systemHealth.geminiAI}
                    </span>
                  </div>
                  <div cl">
                    <span pan>
                    <span className="text-gray-900">1,247</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-be
                  <div className="
                    <Zap className="w-6 h-6 text-purple-600" />
                    <h3 className="font-medium text-gray-900">VAPI Service</h3>
                  </div>
                  {getHealthIconice)}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gr/span>
                    <span classNa`}>
                      {system
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Active Calls</span>
                    <span className="text-gray-900">23</span>
                  </div>
                </div>
              </div>

              <div className=>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <CreditCa0" />
                    <h3 className="font-medium text-gray-900">Payment Gateway</h3>
                  </div>
                  {getHealthI}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between 
                    <span className
                    <span clay)}`}>
                      {syst}
                    </s
                  </div>
                  <div c">
                    /span>
                  
                
             </div>
iv>
            </div>

            {/* Usage Statistics */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg fo
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Intersage</h4>
                  <div className="space-y-3">
                    <den">
                      <div className="flex items-center space-x-2">
                        <Gl" />
                        </span>
                    iv>
                      <span className="text-sm font-medium text-gray-900">
                      min
                      </span>
                    </div>
                    <d">
                      <div className="flex items-center space-x-2">
                        <Br/>
                        <
                    iv>
                  -900">
                
          an>
            >
          iv>
   
        
     <div>
                  <h4 classNaDashboarddmint default A
}

exporyout>
  )dLa</Dashboariv>
    
      </d   )}      </div>
 
        .</p>g soon..ominerface curation intonfigtform c>Plat-gray-600"sName="tex   <p clas>
         </h3ngsm Setti-2">Syste00 mbt-gray-9t-medium texlg foname="text-h3 classN         < />
    mb-4"uto00 mx-at-gray-416 h-16 texsName="w-asgs clettin      <S>
      r py-12"entet-c"texlassName=    <div c  (
    & ttings' &se=== 'iveTab  {act  )}

             v>
 </di        ..</p>
 oming soon.dashboard cnalytics rehensive a00">Comp-gray-6xtName="te   <p class    </h3>
     yticsnced Analdva>Ay-900 mb-2"xt-graum teedilg font-mext-"tclassName=    <h3 
        b-4" />o m00 mx-autt-gray-46 texh-1="w-16 assNameendingUp cl  <Tr         ">
 r py-12"text-centeassName=     <div cl   s' && (
  ytic= 'analTab ==    {active  )}

         </div>
 
          .</p> soon..ingominterface cgement terview manad intaile600">Dey-e="text-gralassNamp c         <t</h3>
   enemnagiew Marv>Inte2"-900 mb- text-graynt-medium-lg foame="text3 classN <h           />
  mb-4"uto00 mx-at-gray-4-16 tex-16 he="wassNamclare <MessageSqu        
    ">2enter py-1="text-csName  <div clas    & (
    ' &interviews== 'ab =  {activeT      
  )}

        </div>     ..</p>
   on.ming soterface coanagement inser m u0">Detailedt-gray-60sName="texp clas           <
 h3>ment</er Manage">Us900 mb-2text-gray-dium ont-meg fe="text-l classNam       <h3/>
     uto mb-4" 0 mx-ay-40ext-grah-16 t"w-16 lassName=<Users c      ">
      -12t-center py"texsName=v clas      <di(
    s' &&  === 'user {activeTab/}
       rs *laceholdes per tab* Oth
        {/ )}
       </div>
         </div>
             </div>
      v>
             </di               </div>
           
       ))}              iv>
     </d              iv>
     /d           <          
   e}%)</span>centag({type.per00">ray-5s text-ge="text-xamspan classN           <            
   t}</span>un{type.co00">ay-9ext-grnt-medium t"text-sm foclassName=n  <spa                     2">
    pace-x-ter stems-cenlex iName="f classdiv           <             pan>
e}</se.typ0">{typext-gray-60="text-sm tameassNcl  <span                      
 y-between"> justifms-centerx itesName="fleype} clas.t{type <div key=                    
  => (map((type)ypeData.interviewT  {                  ">
y-3"space-assName=div cl           <       s</h4>
ype TewterviInb-3">-900 mt-grayt-medium tex"fonme=