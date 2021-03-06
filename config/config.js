/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

module.exports = function (fs, path, url, convict) {
  const AVAILABLE_BACKENDS = ["memory", "httpdb", "mysql"]

  var conf = convict({
    env: {
      doc: "The current node.js environment",
      default: "prod",
      format: [ "dev", "test", "stage", "prod" ],
      env: 'NODE_ENV'
    },
    log: {
      level: {
        default: 'info',
        env: 'LOG_LEVEL'
      }
    },
    publicUrl: {
      format: "url",
      // the real url is set by awsbox
      default: "http://127.0.0.1:9000",
      env: "PUBLIC_URL"
    },
    secretKeyFile: {
      default: path.resolve(__dirname, '../config/secret-key.json')
    },
    publicKeyFile: {
      default: path.resolve(__dirname, '../config/public-key.json')
    },
    db: {
      backend: {
        format: AVAILABLE_BACKENDS,
        default: "memory",
        env: 'DB_BACKEND'
      },
      available_backends: {
        doc: "List of available key-value stores",
        default: AVAILABLE_BACKENDS
      }
    },
    httpdb: {
      url: {
        doc: 'database api url',
        default: 'http://127.0.0.1:8000'
      }
    },
    mysql: {
      createSchema: {
        default: true,
        env: 'CREATE_MYSQL_SCHEMA'
      },
      patchKey : {
        doc: 'The name of the row in the dbMetadata table which stores the patch level',
        default: 'schema-patch-level',
        format: String
      },
      patchLevel : {
        doc: 'The patch level the database should be set to for this release',
        default: 2,
        format: 'nat'
      },
      master: {
        user: {
          default: 'root',
          env: 'MYSQL_USERNAME'
        },
        password: {
          default: '',
          env: 'MYSQL_PASSWORD'
        },
        database: {
          default: 'fxa',
          env: 'MYSQL_DATABASE'
        },
        host: {
          default: '127.0.0.1',
          env: 'MYSQL_HOST'
        },
        port: {
          default: '3306',
          env: 'MYSQL_PORT'
        },
        connectionLimit: {
          doc: "The maximum number of connections to create at once.",
          default: 10,
          format: 'nat',
          env: 'MYSQL_CONNECTION_LIMIT'
        },
        waitForConnections: {
          doc: "Determines the pool's action when no connections are available and the limit has been reached.",
          default: true,
          format: Boolean,
          env: 'MYSQL_WAIT_FOR_CONNECTIONS'
        },
        queueLimit: {
          doc: "Determines the maximum size of the pool's waiting-for-connections queue.",
          default: 100,
          format: 'nat',
          env: 'MYSQL_QUEUE_LIMIT'
        }
      },
      slave : {
        user: {
          default: 'root',
          env: 'MYSQL_SLAVE_USERNAME'
        },
        password: {
          default: '',
          env: 'MYSQL_SLAVE_PASSWORD'
        },
        database: {
          default: 'fxa',
          env: 'MYSQL_SLAVE_DATABASE'
        },
        host: {
          default: '127.0.0.1',
          env: 'MYSQL_SLAVE_HOST'
        },
        port: {
          default: '3306',
          env: 'MYSQL_SLAVE_PORT'
        },
        connectionLimit: {
          doc: "The maximum number of connections to create at once.",
          default: 10,
          format: 'nat',
          env: 'SLAVE_CONNECTION_LIMIT'
        },
        waitForConnections: {
          doc: "Determines the pool's action when no connections are available and the limit has been reached.",
          default: true,
          format: Boolean,
          env: 'SLAVE_WAIT_FOR_CONNECTIONS'
        },
        queueLimit: {
          doc: "Determines the maximum size of the pool's waiting-for-connections queue.",
          default: 100,
          format: 'nat',
          env: 'SLAVE_QUEUE_LIMIT'
        }
      }
    },
    listen: {
      host: {
        doc: "The ip address the server should bind",
        default: '127.0.0.1',
        format: 'ipaddress',
        env: 'IP_ADDRESS'
      },
      port: {
        doc: "The port the server should bind",
        default: 9000,
        format: 'port',
        env: 'PORT'
      }
    },
    customsUrl: {
      doc: "fraud / abuse server url",
      default: 'http://127.0.0.1:7000',
      env: 'CUSTOMS_SERVER_URL'
    },
    contentServer: {
      url: {
        doc: "The url of the corresponding fxa-content-server instance",
        default: 'http://127.0.0.1:3030',
        env: 'CONTENT_SERVER_URL'
      }
    },
    smtp: {
      api: {
        host: {
          doc: 'host for test/mail_helper.js',
          default: '127.0.0.1',
          env: 'MAILER_HOST'
        },
        port: {
          doc: 'port for test/mail_helper.js',
          default: 9001,
          env: 'MAILER_PORT'
        }
      },
      host: {
        doc: 'SMTP host for sending email',
        default: 'localhost',
        env: 'SMTP_HOST'
      },
      port: {
        doc: 'SMTP port',
        default: 25,
        env: 'SMTP_PORT'
      },
      secure: {
        doc: 'Connect to SMTP host securely',
        default: false,
        env: 'SMTP_SECURE'
      },
      user: {
        doc: 'SMTP username',
        format: String,
        default: undefined,
        env: 'SMTP_USER'
      },
      password: {
        doc: 'SMTP password',
        format: String,
        default: undefined,
        env: 'SMTP_PASS'
      },
      sender: {
        doc: 'email address of the sender',
        default: 'Firefox Accounts <no-reply@lcip.org>',
        env: 'SMTP_SENDER'
      },
      verificationUrl: {
        doc: 'Deprecated. uses contentServer.url',
        format: String,
        default: undefined,
        env: 'VERIFY_URL',
        arg: 'verify-url'
      },
      passwordResetUrl: {
        doc: 'Deprecated. uses contentServer.url',
        format: String,
        default: undefined,
        env: 'RESET_URL',
        arg: 'reset-url'
      },
      redirectDomain: {
        doc: 'Domain that mail urls are allowed to redirect to',
        format: String,
        default: 'firefox.com'
      },
      resendBlackoutPeriod: {
        doc: 'Blackout period for resending verification emails',
        default: 1000 * 60 * 10
      }
    },
    toobusy: {
      maxLag: {
        doc: "Max event-loop lag before toobusy reports failure",
        default: 0,
        env: 'TOOBUSY_MAX_LAG'
      }
    },
    i18n: {
      defaultLanguage: {
        format: String,
        default: "en-US"
      },
      locales: {
        default: ["ca", "cs", "cy", "da", "de", "en-US", "es", "es-AR",
                  "es-CL", "et", "eu", "ff", "fr", "fy", "he", "hu", "id",
                  "it", "ja", "ko", "lt", "nb-NO", "nl", "pa", "pl", "pt",
                  "pt-BR", "rm", "ru", "sk", "sl", "sq", "sr", "sr-LATN",
                  "sv", "tr", "zh-CN", "zh-TW"]
      }
    },
    tokenLifetimes: {
      accountResetToken: {
        default: 1000 * 60 * 15
      },
      passwordForgotToken: {
        default: 1000 * 60 * 15
      },
      passwordChangeToken: {
        default: 1000 * 60 * 15
      }
    },
    verifierVersion: {
      doc: 'verifer version for new and changed passwords',
      default: 1
    },
    snsTopicArn: {
      doc: 'Amazon SNS topic on which to send account event notifications',
      format: String,
      default: ''
    },
    bounces: {
      region: {
        doc: 'The region where the queues live, most likely the same region we are sending email e.g. us-east-1, us-west-2',
        format: String,
        default: ''
      },
      bounceQueueUrl: {
        doc: 'The bounce queue URL to use (should include https://sqs.<region>.amazonaws.com/<account-id>/<queue-name>)',
        format: String,
        default: '',
      },
      complaintQueueUrl: {
        doc: 'The complaint queue URL to use (should include https://sqs.<region>.amazonaws.com/<account-id>/<queue-name>)',
        format: String,
        default: '',
      }
    },
    useHttps: {
      doc: "set to true to serve directly over https",
      default: false
    },
    keyPath: {
      doc: "path to SSL key in PEM format if serving over https",
      default: path.resolve(__dirname, '../key.pem')
    },
    certPath: {
      doc: "path to SSL certificate in PEM format if serving over https",
      default: path.resolve(__dirname, '../cert.pem')
    },
  })

  // handle configuration files.  you can specify a CSV list of configuration
  // files to process, which will be overlayed in order, in the CONFIG_FILES
  // environment variable. By default, the ./config/<env>.json file is loaded.

  var envConfig = path.join(__dirname, conf.get('env') + '.json')
  var files = (envConfig + ',' + process.env.CONFIG_FILES)
                .split(',').filter(fs.existsSync)
  conf.loadFile(files)

  // set the public url as the issuer domain for assertions
  conf.set('domain', url.parse(conf.get('publicUrl')).host)

  // deprecated smtp urls
  conf.set('smtp.verificationUrl', conf.get('contentServer.url') + '/v1/verify_email')
  conf.set('smtp.passwordResetUrl', conf.get('contentServer.url') + '/v1/complete_reset_password')

  conf.validate()

  return conf
}
